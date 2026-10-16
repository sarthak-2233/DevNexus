
import { runWebsiteWorkflow } from "../services/websiteWorkflow.js";

export async function generateWebsite(req, res) {
  try {
    const { prompt } = req.body ?? {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a website description.",
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "The description must be 5000 characters or fewer.",
      });
    }

    // Run planning, code generation, and workspace saving through LangGraph.
    const result = await runWebsiteWorkflow(prompt.trim());

    const { project, websiteSpec } = result;

    return res.status(200).json({
      success: true,
      data: {
        projectId: project.projectId,
        projectPath: project.projectPath,
        websiteSpec,
        files: project.files,
      },
    });
  } catch (error) {
    console.error("Website generation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Website generation failed. Please try again.",
    });
  }
}
