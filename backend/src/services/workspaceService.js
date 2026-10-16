import { randomUUID } from "node:crypto";
import {
  mkdir,
  writeFile,
  rename,
  rm,
  copyFile,
  readdir,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateProductionBuild } from "./buildValidationService.js";
import { repairWebsiteFiles } from "./codeRepairService.js";
import { validateWebsiteFiles } from "./websiteValidationService.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const workspaceRoot = path.resolve(
  currentDirectory,
  "../../../workspaces/generated-projects"
);

const templateRoot = path.resolve(
  currentDirectory,
  "../../../templates/react-vite"
);

const allowedFiles = new Set([
  "src/App.jsx",
  "src/main.jsx",
  "src/index.css",
]);

const MAX_REPAIR_ATTEMPTS = 2;

async function copyTemplate(source, destination) {
  await mkdir(destination, { recursive: true });

  const entries = await readdir(source, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyTemplate(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

async function renameWithRetry(
  source,
  destination,
  maxAttempts = 5
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await rename(source, destination);
      return;
    } catch (error) {
      const retryableErrors = ["EPERM", "EBUSY", "EACCES"];

      if (
        !retryableErrors.includes(error.code) ||
        attempt === maxAttempts
      ) {
        throw error;
      }

      const delay = attempt * 1000;

      console.warn(
        `Project rename attempt ${attempt}/${maxAttempts} failed (${error.code}). Retrying in ${delay}ms...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
}



function validateFileEntries(files) {
  return (
    Array.isArray(files) &&
    files.length === allowedFiles.size &&
    files.every(
      (file) =>
        file &&
        allowedFiles.has(file.path) &&
        typeof file.content === "string" &&
        file.content.trim()
    ) &&
    new Set(files.map((file) => file.path)).size === files.length
  );
}

async function writeGeneratedFiles(directory, files) {
  for (const file of files) {
    const destination = path.join(directory, file.path);

    await mkdir(path.dirname(destination), {
      recursive: true,
    });

    await writeFile(destination, file.content, "utf8");
  }
}

export async function saveWebsiteFiles(files, websiteSpec) {
  const projectId = randomUUID();

  const projectDirectory = path.join(
    workspaceRoot,
    projectId
  );

  const temporaryDirectory = path.join(
    workspaceRoot,
    `.tmp-${projectId}`
  );

  if (!validateFileEntries(files)) {
    throw new Error("Invalid generated files.");
  }

  // Keep track of the latest version, including any AI repairs.
  let currentFiles = files;
  let repairAttempts = 0;
  let published = false;

  await mkdir(workspaceRoot, { recursive: true });

  try {
    // 1. Copy the starter template into a temporary workspace.
    await mkdir(temporaryDirectory, { recursive: true });
    await copyTemplate(templateRoot, temporaryDirectory);

    // 2. Write the original generated files.
    await writeGeneratedFiles(
      temporaryDirectory,
      currentFiles
    );

    // 3. Attempt the initial production build.
    //    Install dependencies on the first build so vite and other
    //    required packages are available.
    let buildResult = await validateProductionBuild(
      temporaryDirectory,
      { installDependencies: true }
    );

    // 4. If the build fails, ask Gemini to repair the code.
    for (
      let attempt = 1;
      !buildResult.success && attempt <= MAX_REPAIR_ATTEMPTS;
      attempt++
    ) {
      repairAttempts = attempt;

      console.warn(
        `Production build failed. Starting AI repair ${attempt}/${MAX_REPAIR_ATTEMPTS}.`
      );

      currentFiles = await repairWebsiteFiles({
        websiteSpec,
        files: currentFiles,
        buildError:
          buildResult.output || buildResult.message,
      });

      // Check the repair response before writing it to disk.
      if (!validateFileEntries(currentFiles)) {
        throw new Error(
          "The AI repair agent returned invalid generated files."
        );
      }

      const validation = await validateWebsiteFiles(
        currentFiles
      );

      if (!validation.valid) {
        throw new Error(
          `AI repair failed file validation: ${validation.errors.join("; ")}`
        );
      }

      if (validation.warnings.length > 0) {
        console.warn(
          "AI repair validation warnings:",
          validation.warnings
        );
      }

      // Overwrite the generated files with the repaired versions.
      await writeGeneratedFiles(
        temporaryDirectory,
        currentFiles
      );

      // Dependencies are already installed. Rebuild without reinstalling.
      buildResult = await validateProductionBuild(
        temporaryDirectory,
        { installDependencies: false }
      );
    }

    // 5. Never publish a project that still fails to build.
    if (!buildResult.success) {
      throw new Error(
        `Generated website failed its production build after ${MAX_REPAIR_ATTEMPTS} repair attempts.\n${buildResult.output}`
      );
    }

    // 6. Write metadata only after a successful build.
    const metadata = {
      projectId,
      createdAt: new Date().toISOString(),
      websiteSpec,
      files: currentFiles.map((file) => file.path),
      build: {
        success: true,
        validatedAt: new Date().toISOString(),
        repairAttempts,
      },
    };

    await writeFile(
      path.join(temporaryDirectory, "project.json"),
      JSON.stringify(metadata, null, 2),
      "utf8"
    );

    // 7. Publish only after validation and metadata writing succeed.
  console.log("Production build passed. Publishing project...");

await renameWithRetry(
  temporaryDirectory,
  projectDirectory
);

published = true;

console.log("Project published successfully:", projectId);
    return {
      projectId,
      projectPath: projectDirectory,
      build: {
        success: true,
        message: buildResult.message,
      },
      files: currentFiles.map((file) => ({
        path: file.path,
        saved: true,
      })),
    };
  } catch (error) {
    console.error(
      "Website workspace creation failed:",
      error.message
    );

    throw error;
  } finally {
    // Clean up failed temporary projects, but never delete a published project.
    if (!published) {
      try {
        await rm(temporaryDirectory, {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 1000,
        });
      } catch (cleanupError) {
        console.error(
          "Temporary project cleanup failed:",
          cleanupError.message
        );
      }
    }
  }
}