import { randomUUID } from "node:crypto";
import {
  mkdir,
  writeFile,
  rename,
  rm,
  copyFile,
  readdir,
  access,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Stores generated projects in DevNexus/workspaces/generated-projects
const workspaceRoot = path.resolve(
  currentDirectory,
  "../../../workspaces/generated-projects"
);

// Starter template (React + Vite) lives at DevNexus/templates/react-vite
const templateRoot = path.resolve(
  currentDirectory,
  "../../../templates/react-vite"
);

const allowedFiles = new Set([
  "src/App.jsx",
  "src/main.jsx",
  "src/index.css",
]);

async function copyTemplate(source, destination) {
  await mkdir(destination, { recursive: true });

  const entries = await readdir(source, { withFileTypes: true });

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

export async function saveWebsiteFiles(files, websiteSpec) {
  const projectId = randomUUID();
  const projectDirectory = path.join(workspaceRoot, projectId);
  const temporaryDirectory = path.join(workspaceRoot, `.tmp-${projectId}`);

  // Only allow the three expected generated files.
  if (
    !Array.isArray(files) ||
    files.length !== allowedFiles.size ||
    files.some(
      (file) =>
        !file ||
        !allowedFiles.has(file.path) ||
        typeof file.content !== "string"
    ) ||
    new Set(files.map((file) => file.path)).size !== files.length
  ) {
    throw new Error("Invalid generated files.");
  }

  // Fail fast if the template folder is missing.
  try {
    await access(templateRoot);
  } catch {
    throw new Error(
      `Template directory not found: ${templateRoot}. ` +
        `Create it and add your starter project files.`
    );
  }

  await mkdir(workspaceRoot, { recursive: true });
  await mkdir(temporaryDirectory, { recursive: true });

  try {
    // 1. Copy the starter template into the temp directory.
    await copyTemplate(templateRoot, temporaryDirectory);

    // 2. Overwrite/add the AI-generated files.
    for (const file of files) {
      const destination = path.join(temporaryDirectory, file.path);

      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, file.content, "utf8");
    }

    // 3. Write metadata.
    const metadata = {
      projectId,
      createdAt: new Date().toISOString(),
      websiteSpec,
      files: files.map((file) => file.path),
    };

    await writeFile(
      path.join(temporaryDirectory, "project.json"),
      JSON.stringify(metadata, null, 2),
      "utf8"
    );

    // 4. Publish the project only after all files have been written.
    await rename(temporaryDirectory, projectDirectory);

    return {
      projectId,
      projectPath: projectDirectory,
      files: files.map((file) => ({
        path: file.path,
        saved: true,
      })),
    };
  } catch (error) {
    await rm(temporaryDirectory, {
      recursive: true,
      force: true,
    });
    throw error;
  }
}