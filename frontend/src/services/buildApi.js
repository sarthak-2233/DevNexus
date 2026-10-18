
import { pipeline } from "@/config/pipeline";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function runBuild(prompt, { onStep } = {}) {
  // Show that the request has started.
   console.log("[WebForge] runBuild called:", prompt);
  if (pipeline.length > 0) {
    onStep?.(0, "running");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/api/websites/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Make sure the backend is running on port 5000."
    );
  }

  const body = await response.json().catch(() => null);

  console.log("[WebForge] API URL:", API_URL);
  if (!response.ok || !body?.success) {
    throw new Error(
      body?.message || `Website generation failed (HTTP ${response.status}).`
    );
  }

  const data = body.data;

  if (!data?.projectId) {
    throw new Error("The backend response did not include a project ID.");
  }

  // The backend currently returns one final result, not live agent events.
  for (let i = 0; i < pipeline.length; i++) {
    onStep?.(i, "done");
  }

  const title =
    data.websiteSpec?.title ||
    data.websiteSpec?.name ||
    prompt.slice(0, 48);

  return {
    title,
    pages: Array.isArray(data.files) ? data.files.length : 0,
    projectId: data.projectId,
    projectPath: data.projectPath,
    websiteSpec: data.websiteSpec,
    files: data.files,
  };
}
