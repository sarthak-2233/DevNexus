export const agents = [
  { n: "Planner", s: "scopes the brief", x: 260, y: 58 },
  { n: "Designer", s: "sets the look", x: 452, y: 172 },
  { n: "Coder", s: "writes the pages", x: 380, y: 392 },
  { n: "Reviewer", s: "tests and audits", x: 140, y: 392 },
  { n: "Deployer", s: "ships to live", x: 68, y: 172 },
];

// kind: b = memory/info, g = success, r = failure, "" = neutral
export const logs = [
  { n: "Planner", r: "Turns your brief into pages and goals", l: [
    ["b", "plan", 'reading brief: "bakery site with online orders"'],
    ["", "memory", "search → 0 similar projects"],
    ["", "plan", "pages: home, menu, order, contact"],
    ["g", "done", "handoff → Designer"]] },
  { n: "Designer", r: "Chooses type, color and layout", l: [
    ["b", "memory", 'search → "warm, handmade" tone'],
    ["", "design", "palette: flour #f6efe4, crust #b0662c"],
    ["", "design", "type: serif display, sans body"],
    ["g", "saved", "tokens written to memory"],
    ["g", "done", "handoff → Coder"]] },
  { n: "Coder", r: "Builds responsive pages from the design", l: [
    ["b", "memory", "fetch → design tokens"],
    ["", "code", "generating Home.tsx, Menu.tsx"],
    ["", "code", "wiring order form to API"],
    ["g", "done", "handoff → Reviewer"]] },
  { n: "Reviewer", r: "Audits accessibility, speed and links", l: [
    ["b", "audit", "contrast check on 14 elements"],
    ["r", "fail", "menu button below 4.5:1"],
    ["", "route", "fix → Coder (1 issue)"],
    ["g", "pass", "all checks passed"]] },
  { n: "Deployer", r: "Ships the build and sets up the domain", l: [
    ["b", "build", "bundle 118 kB, 94 Lighthouse"],
    ["", "deploy", "uploading to edge network"],
    ["", "dns", "cake-co.example connected"],
    ["g", "live", "site is live"]] },
];
