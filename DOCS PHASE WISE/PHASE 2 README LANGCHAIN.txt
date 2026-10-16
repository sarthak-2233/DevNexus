# WebForge AI — AI Website Builder

WebForge AI is an AI-powered website builder that transforms a natural-language prompt into a generated React website. It uses Gemini for website planning, design planning, and code generation, with LangGraph orchestrating the workflow.

The backend validates generated files, runs a production build, attempts AI-powered code repair when a build fails, and publishes successful projects into a local workspace.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [How the Workflow Works](#how-the-workflow-works)
5. [Backend Services](#backend-services)
6. [Problems Encountered and Solutions](#problems-encountered-and-solutions)
7. [Installation and Setup](#installation-and-setup)
8. [Running the Backend](#running-the-backend)
9. [Generating a Website](#generating-a-website)
10. [Running a Generated Website](#running-a-generated-website)
11. [Validation and AI Repair](#validation-and-ai-repair)
12. [Current Limitations](#current-limitations)
13. [Upcoming Development: Qdrant](#upcoming-development-qdrant)
14. [Development Roadmap](#development-roadmap)

---

## Project Overview

WebForge AI is designed to automate the initial website development process.

A user describes a website in natural language, for example:

> Build a premium photography portfolio with a fullscreen hero, categorized galleries, an about section, and a contact form.

The backend then:

- Creates a structured website specification.
- Develops a design plan.
- Generates React and CSS files.
- Validates the generated files.
- Builds the generated project.
- Attempts AI-powered repairs if the build fails.
- Publishes the project after a successful build.

### Current milestone

The backend has successfully generated and saved a website called **Aura Visuals**, a premium photography portfolio. The generated website was opened in the browser and confirmed to work.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Backend and frontend development |
| Node.js | Backend runtime |
| Express | HTTP API server |
| Gemini API | Website planning, design generation, and code generation |
| `@google/genai` | Gemini SDK |
| LangGraph.js | Multi-step AI workflow orchestration |
| Zod | Structured-data and generated-file validation |
| React | Generated website interface |
| Vite | Development server and production bundler |
| npm | Dependency management and build commands |
| Qdrant | Planned vector database integration |

---

## Project Structure

The main project directory is:

`C:\WORKING PROJECTS\DevNexus`

The relevant structure is:

```text
DevNexus/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── websiteController.js
│   │   ├── services/
│   │   │   ├── geminiService.js
│   │   │   ├── designAgentService.js
│   │   │   ├── websiteCodeService.js
│   │   │   ├── generatedFilesSchema.js
│   │   │   ├── websiteSchema.js
│   │   │   ├── websiteValidationService.js
│   │   │   ├── buildValidationService.js
│   │   │   ├── codeRepairService.js
│   │   │   ├── workspaceService.js
│   │   │   └── websiteWorkflow.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── templates/
│   └── react-vite/
│       ├── package.json
│       ├── index.html
│       └── ...
├── workspaces/
│   └── generated-projects/
│       └── <project-id>/
└── README.md
```

*This is a guide to the relevant files; the exact directory contents may differ.*

### Important directories

**Backend**

`C:\WORKING PROJECTS\DevNexus\backend`

**React/Vite starter template**

`C:\WORKING PROJECTS\DevNexus\templates\react-vite`

**Generated websites**

`C:\WORKING PROJECTS\DevNexus\workspaces\generated-projects`

---

## How the Workflow Works

The website-generation workflow is coordinated by LangGraph.

```text
User Prompt
    |
    v
Planning Agent
    |
    v
Design Agent
    |
    v
Code Generation Agent
    |
    v
Generated File Validation
    |
    v
Temporary Workspace Creation
    |
    v
Production Build
    |
    +---- Build fails ----> AI Code Repair
    |                           |
    |                           v
    |                      Revalidate Files
    |                           |
    |                           v
    |                       Rebuild
    |                           |
    |                           v
    |                   Up to 2 repair attempts
    |
    +---- Build succeeds
                |
                v
        Write project.json
                |
                v
        Publish Project
                |
                v
        Return API Response
```

### 1. Planning agent

The planning agent receives the user's prompt and asks Gemini to generate a structured website specification.

The specification contains:

- Website name
- Purpose
- Target audience
- Pages and URL slugs
- Sections for each page
- Features
- Design information
- Components

### 2. Design agent

The design agent develops the visual direction, including:

- Style
- Color palette
- Typography
- Layout
- Visual direction
- Component guidelines

### 3. Code-generation agent

The code-generation service combines the website specification and design plan, then requests the frontend source code from Gemini.

The current allowed generated files are:

```text
src/App.jsx
src/main.jsx
src/index.css
```

### 4. Validation agent

The validation service checks the generated files before saving them.

It checks required paths, empty files, duplicate paths, unexpected files, the default export in `App.jsx`, expected imports in `main.jsx`, and basic CSS structure.

### 5. Workspace creation and build validation

The workspace service copies the React/Vite starter template into a temporary directory, writes the generated files, installs dependencies, and runs the production build.

### 6. AI code repair

If the production build fails, the repair service sends Gemini the build diagnostics and the current generated files.

Gemini returns repaired versions of the allowed files. The service validates the returned structure before writing the repaired code and rebuilding.

The workflow allows up to two repair attempts.

### 7. Publishing

Only a project that passes the production build should be published. The workspace service writes `project.json` and renames the temporary directory to the final project directory.

---

## Backend Services

### `websiteController.js`

Handles the website-generation API request, invokes the LangGraph workflow, and returns the generated project's information.

### `geminiService.js`

Generates the website specification through Gemini and validates the result against the website schema.

It also normalizes page slugs and the color palette before returning valid data.

### `websiteSchema.js`

Defines the expected website specification using Zod.

Each page must have a title, slug, purpose, and at least one section. Required fields remain subject to schema validation.

### `designAgentService.js`

Generates the website's design plan using Gemini.

### `websiteCodeService.js`

Generates the React and CSS files, validates the response structure, and restricts generated output to the allowed file paths.

### `generatedFilesSchema.js`

Validates the generated-files response. It requires exactly three file entries with a path and string content.

### `websiteValidationService.js`

Checks the generated source files for expected paths, valid file entries, imports, exports, and basic CSS structure.

### `buildValidationService.js`

Runs npm dependency installation and the production build in the temporary project directory.

It returns build status and diagnostic output so the workspace service can decide whether to repair the code.

It supports skipping dependency installation on subsequent repair builds.

### `codeRepairService.js`

Uses Gemini to repair generated code after a failed production build.

It restricts the repair response to the three allowed files and validates the response before returning it.

### `workspaceService.js`

Manages the generated project's lifecycle:

- Creates a unique project ID.
- Copies the starter template.
- Writes generated files.
- Runs the production build.
- Requests AI repairs if necessary.
- Writes project metadata.
- Publishes successful projects.
- Cleans up failed temporary workspaces.

### `websiteWorkflow.js`

Defines the LangGraph nodes and their execution order, coordinating planning, design, code generation, validation, and workspace publishing.

---

## Problems Encountered and Solutions

### Problem 1: Invalid generated JSX

**Observed issue:** Vite reported an unterminated regular expression in generated `App.jsx` during email validation.

**Why it happened:** AI-generated code can contain invalid JavaScript or JSX even when the overall file structure is correct.

**Solution:** Added production-build validation and an AI code-repair service.

**Lesson:** Valid JSON and valid file structure do not guarantee compilable JavaScript. A production build is necessary.

### Problem 2: Windows `spawn EINVAL`

**Observed issue:** The npm build process encountered a Windows process-spawning error.

**Why it happened:** Windows command launching differs from Unix-like systems, including how npm command shims are invoked.

**Solution:** The build-validation service was adjusted to invoke `npm.cmd` with Windows-compatible shell handling.

### Problem 3: Slow dependency installation

**Observed issue:** Dependency installation took approximately five minutes and installed around 181 packages.

**Why it mattered:** Reinstalling dependencies after every code repair would waste time.

**Solution:** The initial build installs dependencies. Subsequent repair builds use the existing `node_modules` directory and skip installation.

### Problem 4: Windows `EPERM` during directory rename

**Observed issue:** Windows rejected the rename from a temporary workspace to the final project directory.

**Why it can happen:** A process, antivirus scanner, file indexer, or other application may hold a file or directory open.

**Solution:** Added a retry helper for transient `EPERM`, `EBUSY`, and `EACCES` errors.

**Important:** Retrying helps only when the lock is temporary. Persistent filesystem errors may require identifying and releasing the process holding the directory open.

### Problem 5: Syntax error in the rename helper

**Observed issue:** Node reported a syntax error while the helper was being edited.

**Solution:** Corrected the helper and tested service imports before running another expensive generation request.

**Lesson:** Test module imports after code edits before testing the complete workflow.

### Problem 6: Empty page slug from Gemini

**Observed issue:** Zod rejected the website specification because `pages[0].slug` was empty.

**Why it happened:** Model output may violate constraints despite instructions and structured-output settings.

**Solution:** Added slug normalization before schema validation. Empty slugs are derived from page titles, and duplicate slugs receive unique suffixes.

The Zod schema remains strict; normalization fixes predictable issues before validation.

---

## Installation and Setup

### Prerequisites

Install:

- Node.js
- npm
- Git (recommended)

You will also need a Gemini API key.

### 1. Open the backend directory

```powershell
cd "C:\WORKING PROJECTS\DevNexus\backend"
```

### 2. Install backend dependencies

If dependencies have not already been installed:

```powershell
npm install
```

### 3. Configure environment variables

Create or update `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace the placeholder with your actual key.

**Security:** Do not commit `.env` or expose your API key in frontend code or public repositories.

### 4. Verify the starter template

Confirm that this directory exists:

```text
C:\WORKING PROJECTS\DevNexus\templates\react-vite
```

It must contain a working React/Vite project with a valid `package.json`.

---

## Running the Backend

Open PowerShell:

```powershell
cd "C:\WORKING PROJECTS\DevNexus\backend"
nodemon src/server.js
```

If Nodemon is not installed or configured, use the start script in `package.json`, if available.

The backend should report that it is running at:

```text
http://localhost:5000
```

### Health check

Send a GET request to:

```text
http://localhost:5000/api/health
```

Expected: a successful health response.

---

## Generating a Website

Use Postman or another HTTP client.

**Method:** `POST`

**URL:**

```text
http://localhost:5000/api/websites/generate
```

**Body type:** `raw` → `JSON`

Example request:

```json
{
  "prompt": "Build a modern responsive coffee shop website with a hero section, menu cards, opening hours, customer testimonials, and a contact form with email validation."
}
```

A successful response includes fields such as:

- `success`
- `data.projectId`
- `data.projectPath`
- `data.websiteSpec`
- `data.files`

Use the returned project path to open the generated website.

---

## Running a Generated Website

Navigate to the generated project's directory. Replace `<PROJECT_ID>` with the ID returned by the API.

```powershell
cd "C:\WORKING PROJECTS\DevNexus\workspaces\generated-projects\<PROJECT_ID>"
```

Start Vite:

```powershell
npm run dev
```

Open the local URL printed in the terminal, usually:

```text
http://localhost:5173/
```

If dependencies are missing:

```powershell
npm install
npm run dev
```

---

## Validation and AI Repair

The current validation approach uses multiple layers.

| Layer | Purpose |
|---|---|
| Website specification schema | Checks required planning fields |
| Generated-files schema | Checks the generated response structure |
| Website file validator | Checks paths and basic source structure |
| Production build | Detects actual compile/build errors |
| AI code repair | Attempts to fix build failures |
| Final publishing check | Prevents publishing a project that still fails its build |

### Testing a service import

Run this from the backend directory:

```powershell
node --input-type=module -e "import('./src/services/workspaceService.js').then(() => console.log('Workspace service imported successfully.')).catch(err => { console.error(err); process.exit(1); })"
```

This verifies that the service can be imported. It does not run Gemini or execute a production build.

### What build success does not guarantee

A successful Vite production build does not prove that:

- Every button works.
- Forms submit to a real backend.
- Email is actually delivered.
- Every route exists and works.
- All responsive layouts are visually correct.
- The generated website meets every accessibility requirement.

These need separate tests.

---

## Current Limitations

- The generated output is currently restricted to three frontend files.
- Generated forms do not automatically send emails without an implemented backend or external integration.
- Build validation confirms compilation, not complete functional correctness.
- AI repair is limited to two attempts.
- Generated projects are saved to the local filesystem.
- Persistent Windows file locks may still prevent publishing.
- Qdrant retrieval has not yet been integrated.
- There is not yet a confirmed persistent knowledge-retrieval layer for previous websites and verified fixes.

Generated source code should be treated as untrusted. Continue restricting writable paths and avoid allowing generated output to modify arbitrary files or execute arbitrary shell commands.

---

## Upcoming Development: Qdrant

Qdrant is the planned next milestone.

The objective is to let WebForge AI retrieve relevant, reusable knowledge before planning or generating a website.

Potential knowledge to store:

- Website design patterns
- Layout recommendations
- Component guidelines
- Previously successful website specifications
- Known build errors and verified fixes
- Industry-specific design examples

### Proposed future retrieval flow

```text
User Prompt
    |
    v
Create Search Query / Embedding
    |
    v
Retrieve Relevant Knowledge from Qdrant
    |
    v
Planning Agent
    |
    v
Design Agent
    |
    v
Code Generation
    |
    v
Validation and Build
    |
    v
Repair if Needed
    |
    v
Publish
```

### Planned implementation steps

1. Choose an embedding model and verify its API.
2. Run Qdrant locally or select a suitable hosted deployment.
3. Create a Qdrant collection with the correct vector dimensions and distance metric.
4. Define a document format and metadata schema.
5. Add a service to insert, update, and search knowledge.
6. Test vector retrieval independently with known queries.
7. Add retrieval as a step in LangGraph.
8. Pass retrieved information into planning and design prompts as supporting context.
9. Test whether retrieval improves relevance and consistency without overriding the user's requirements.

**Do not treat Qdrant as already implemented.** It is the next planned milestone.

---

## Development Roadmap

### Completed foundation

- [x] Express backend
- [x] Gemini website planning
- [x] Structured website specification
- [x] Design agent
- [x] React code generation
- [x] LangGraph orchestration
- [x] Zod schema validation
- [x] Generated-file validation
- [x] Temporary project workspaces
- [x] Production-build validation
- [x] AI code-repair service and bounded repair loop
- [x] Project metadata and publishing
- [x] Successful generated website verified in the browser

### Next milestones

- [ ] Verify the AI repair path using a controlled build failure
- [ ] Add Qdrant and test vector retrieval independently
- [ ] Integrate retrieval into the LangGraph workflow
- [ ] Add functional browser tests for generated sites
- [ ] Improve route and interaction validation
- [ ] Add project history and persistent project metadata
- [ ] Develop the user-facing frontend for WebForge AI

---

## Latest Successful Project

**Name:** Aura Visuals

**Purpose:** Premium photography portfolio

**Project ID:**

```text
8320a940-94bd-4387-9d34-092bc3048a68
```

**Project path:**

```text
C:\WORKING PROJECTS\DevNexus\workspaces\generated-projects\8320a940-94bd-4387-9d34-092bc3048a68
```

**Generated pages:**

- Home
- Portfolio
- About
- Contact

**Generated files:**

- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`

The user confirmed that the generated website runs correctly in the browser.

---

## Final Summary

WebForge AI now has a working local backend that plans websites, generates designs and React source files, validates them, checks production builds, attempts AI-powered repairs, and publishes successful projects.

The next planned milestone is Qdrant integration, beginning with an independently tested retrieval service before modifying the existing LangGraph workflow.
