import { pipeline } from "@/config/pipeline";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Runs a build for the given prompt and reports progress per agent.
 * Right now this is a simulation. To connect your LangChain / LangGraph
 * backend, replace the body with a real request, for example:
 *
 *   const res = await fetch(`${import.meta.env.VITE_API_URL}/build`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ prompt }),
 *   });
 *   // stream events from your server and call onStep(index, "running" | "done")
 */
export async function runBuild(prompt, { onStep }) {
  for (let i = 0; i < pipeline.length; i++) {
    onStep(i, "running");
    await wait(1000 + Math.random() * 800);
    onStep(i, "done");
  }
  return { title: prompt.length > 48 ? `${prompt.slice(0, 45)}…` : prompt, pages: 4 };
}
