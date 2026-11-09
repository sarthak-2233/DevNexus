import path from "node:path";
import { stat } from "node:fs/promises";
import { ZipArchive } from "archiver";

const PROJECTS_ROOT = path.resolve(
  process.cwd(),
  "../workspaces/generated-projects"
);

export async function downloadProject(req, res, next) {
  try {
    const { projectId } = req.params;

    // Accept only UUID-style project IDs, never arbitrary paths.
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        projectId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const projectDirectory = path.join(PROJECTS_ROOT, projectId);
    const projectInfo = await stat(projectDirectory).catch(() => null);

    if (!projectInfo?.isDirectory()) {
      return res.status(404).json({
        success: false,
        message: "Generated project not found.",
      });
    }

    res.attachment(`webforge-${projectId}.zip`);

    const archive = new ZipArchive({
      zlib: { level: 6 },
    });

    archive.on("error", (error) => {
      if (!res.headersSent) {
        next(error);
      } else {
        res.destroy(error);
      }
    });

    archive.pipe(res);

    archive.glob("**/*", {
      cwd: projectDirectory,
      ignore: [
        "node_modules/**",
        "dist/**",
        ".git/**",
      ],
      dot: true,
    });

    await archive.finalize();
  } catch (error) {
    next(error);
  }
}