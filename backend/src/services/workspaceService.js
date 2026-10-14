
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Stores generated projects in webforge-ai/workspaces/generated-projects
const workspaceRoot = path.resolve(
  currentDirectory,
  "../../../workspaces/generated-projects"
);

const allowedFiles = new Set([
  "src/App.jsx",
  "src/main.jsx",
  "src/index.css",
]);

export async function saveWebsiteFiles(files, websiteSpec) {
  const projectId = randomUUID();
  const projectDirectory = path.join(workspaceRoot, projectId);
  const temporaryDirectory = path.join(
    workspaceRoot,
    `.tmp-${projectId}`
  );

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

  await mkdir(workspaceRoot, { recursive: true });
  await mkdir(temporaryDirectory, { recursive: true });

  try {
    for (const file of files) {
      const destination = path.join(
        temporaryDirectory,
        file.path
      );

      await mkdir(path.dirname(destination), {
        recursive: true,
      });

      await writeFile(destination, file.content, "utf8");
    }

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

    // Publish the project only after all files have been written.
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
