
import { generateWebsiteContent } from "../services/geminiService.js";
import { generateWebsiteFiles } from "../services/websiteCodeService.js";
import { saveWebsiteFiles } from "../services/workspaceService.js";
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

    // Step 1: Understand what the user wants.
    const websiteSpec = await generateWebsiteContent(prompt.trim());

    // Step 2: Generate the actual source files.
    const files = await generateWebsiteFiles(websiteSpec);
    // Step 3: Save the generated files to the workspace.
    const project = await saveWebsiteFiles(files, websiteSpec);
    
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
