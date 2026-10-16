
import {
  Annotation,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { generateWebsiteContent } from "./geminiService.js";
import { generateDesignPlan } from "./designAgentService.js";
import { generateWebsiteFiles } from "./websiteCodeService.js";
import { validateWebsiteFiles } from "./websiteValidationService.js";
import { saveWebsiteFiles } from "./workspaceService.js";

const WebsiteWorkflowState = Annotation.Root({
  prompt: Annotation(),
  websiteSpec: Annotation(),
  designPlan: Annotation(),
  files: Annotation(),
  validation: Annotation(),
  project: Annotation(),
});

async function planningAgent(state) {
  const websiteSpec = await generateWebsiteContent(state.prompt);
  return { websiteSpec };
}

async function designAgent(state) {
  const designPlan = await generateDesignPlan(state.websiteSpec);
  return { designPlan };
}

async function codeGenerationAgent(state) {
  const websiteSpecWithDesign = {
    ...state.websiteSpec,
    design: {
      ...state.websiteSpec.design,
      ...state.designPlan,
    },
  };

  const files = await generateWebsiteFiles(websiteSpecWithDesign);
  return { files };
}

async function validationAgent(state) {
  const validation = await validateWebsiteFiles(state.files);
  return { validation };
}

async function saveWorkspace(state) {
  if (!state.validation?.valid) {
    throw new Error(
      `Website validation failed: ${
        state.validation?.errors?.join("; ") || "Unknown validation error"
      }`
    );
  }

  const project = await saveWebsiteFiles(
    state.files,
    state.websiteSpec
  );

  return { project };
}

const workflow = new StateGraph(WebsiteWorkflowState)
  .addNode("planningAgent", planningAgent)
  .addNode("designAgent", designAgent)
  .addNode("codeGenerationAgent", codeGenerationAgent)
  .addNode("validationAgent", validationAgent)
  .addNode("saveWorkspace", saveWorkspace)
  .addEdge(START, "planningAgent")
  .addEdge("planningAgent", "designAgent")
  .addEdge("designAgent", "codeGenerationAgent")
  .addEdge("codeGenerationAgent", "validationAgent")
  .addEdge("validationAgent", "saveWorkspace")
  .addEdge("saveWorkspace", END)
  .compile();

export async function runWebsiteWorkflow(prompt) {
  return workflow.invoke({ prompt });
}
