// The agents that run on every build. Used by the builder page.
export const pipeline = [
  { id: "planner", name: "Planner", role: "Scoping pages and goals" },
  { id: "designer", name: "Designer", role: "Choosing type, color and layout" },
  { id: "coder", name: "Coder", role: "Writing responsive pages" },
  { id: "reviewer", name: "Reviewer", role: "Auditing accessibility and speed" },
  { id: "deployer", name: "Deployer", role: "Packaging the build" },
];
