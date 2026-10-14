# WebForge AI — Multi-Agent AI Website Builder

> An AI-powered software engineering platform that transforms natural-language requirements into responsive, functional, testable websites using specialized AI agents, workflow orchestration, retrieval-augmented generation, and isolated code execution.

**Project level:** Basic → Intermediate → Advanced → Production-grade engineering  
**Primary language:** TypeScript  
**Orchestration:** LangGraph.js  
**LLM:** Gemini API  
**Vector database:** Qdrant  
**Initial frontend stack:** React, TypeScript, Tailwind CSS  
**Primary database:** PostgreSQL  
**Execution:** Isolated build and browser-testing environments

---

# 1. Project Vision

WebForge AI enables users to describe a website in natural language and receive a working application that they can preview, edit, test, and eventually deploy.

For example:

> Build a premium e-commerce website with a responsive homepage, product listing, product details, shopping cart, authentication screens, and a modern design system.

The system should interpret the request, plan the application, generate code, execute it safely, validate its behavior, and repair failures when possible.

Unlike a basic AI code generator, WebForge AI will use a controlled multi-agent software engineering workflow.

## Core principle

**AI agents plan and propose. Deterministic tools execute. Automated tests validate. The orchestrator controls the workflow.**

## Long-term goals

- Generate multi-page websites from natural-language prompts.
- Support conversational modifications to existing projects.
- Maintain a consistent design system across pages.
- Coordinate specialized agents through LangGraph.
- Retrieve relevant coding knowledge through Qdrant.
- Execute generated code in isolated environments.
- Detect and repair build and runtime failures.
- Preserve project history and support rollback.
- Measure quality, latency, reliability, and cost.
- Provide project export and controlled deployment.

---

# 2. High-Level Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Builder dashboard and preview interface |
| Styling | Tailwind CSS | Responsive design system |
| Backend | Node.js, TypeScript | API and application services |
| AI orchestration | LangGraph.js | Agent workflow and state management |
| LLM | Gemini API | Planning, code generation, and reasoning |
| Vector database | Qdrant | Semantic retrieval |
| Embeddings | Compatible embedding model | Document and query vectors |
| Database | PostgreSQL | Users, projects, jobs, versions, and metadata |
| Queue | Redis with BullMQ | Background generation and build jobs |
| Versioning | Git | Source history, diffs, and rollback |
| Artifact storage | S3-compatible storage | Screenshots, archives, and large artifacts |
| Browser testing | Playwright | Functional and visual testing |
| Code execution | Isolated containers or microVMs | Build and run generated applications |
| Observability | OpenTelemetry-compatible tooling | Logs, metrics, and distributed tracing |
| CI/CD | GitHub Actions or equivalent | Automated validation and deployment |

Do not implement every technology immediately. Introduce each component when the corresponding phase requires it.

---

# 3. The 10-Phase Development Roadmap

The project will be developed through ten milestones. Each phase should produce a working deliverable before the next major layer is introduced.

## Phase 1 — Basic Website Generation

**Level:** Beginner  
**Goal:** Generate a website from a prompt and display a working preview.

### What we build

The initial system accepts a prompt, asks Gemini to generate a small React project, creates its files, runs the build, and displays the result.

### Features

- Basic builder interface.
- Prompt submission.
- Gemini API integration.
- Initial project specification.
- React and TypeScript generation.
- Tailwind CSS styling.
- File creation and project workspace.
- Build execution.
- Preview rendering.
- Basic error reporting.

### Architecture

User → API → Gemini → File Generator → Build Runner → Preview

### Engineering concepts

- Client-server architecture.
- REST APIs.
- Environment variables and secret management.
- Structured model output.
- File-system boundaries.
- Basic error handling.
- Asynchronous job execution.

### Deliverables

- A user can submit a prompt.
- The system generates a basic website.
- The generated application builds successfully.
- The user can inspect a working preview.
- Failed builds return understandable diagnostics.

### Exit criteria

Demonstrate at least five representative prompts and record the build success rate. Every failure should produce a useful error report instead of silently returning broken code.

**Do not add multiple autonomous agents yet.** First prove that the entire generation pipeline works.

---

## Phase 2 — LangGraph Workflow and State Management

**Level:** Beginner to intermediate  
**Goal:** Turn the basic generation pipeline into a stateful, resumable workflow.

### Why this phase matters

A single model call is insufficient for a system that must plan, generate, validate, and recover from failures.

LangGraph will control the sequence of operations and preserve workflow state.

### What we build

- Define the graph state.
- Separate generation into nodes.
- Add conditional routing.
- Add structured outputs and schema validation.
- Add workflow checkpoints.
- Introduce generation-job status.
- Add retry limits and timeouts.
- Add user clarification and cancellation handling.

### Initial graph

START → Validate Request → Plan Website → Generate Files → Build → Validate → Preview → END

If validation fails:

Build or Validation Failure → Repair Attempt → Build Again

### State fields

The conceptual state should contain:

- Project and job identifiers.
- Original user prompt.
- Requirements.
- Design specification.
- Current task.
- Generated file references.
- Build results.
- Test results.
- Retry counters.
- Workflow status.
- Remaining execution budget.

Large files and full logs should live in external storage rather than being copied into graph state.

### Engineering concepts

- Directed graphs.
- State machines.
- Conditional edges.
- Checkpointing.
- Idempotency.
- Retry policies.
- Durable background jobs.
- Workflow recovery.

### Deliverables

A stateful generation workflow that can resume from checkpoints and terminate cleanly when its retry or execution budget is exhausted.

### Exit criteria

Simulate a worker interruption and verify that the job resumes without corrupting project state or repeating unsafe side effects.

---

## Phase 3 — Multi-Agent Planning and Design

**Level:** Intermediate  
**Goal:** Introduce specialized agents with explicit responsibilities.

This is where WebForge AI becomes a genuine multi-agent system.

### Agents

**1. Supervisor Agent**

Coordinates workflow stages, applies routing decisions, and enforces execution policies.

**2. Product Planning Agent**

Transforms the user's prompt into structured requirements, pages, user journeys, and acceptance criteria.

**3. Design Agent**

Defines the visual system, typography, colors, spacing, breakpoints, and component rules.

**4. Task Planning Agent**

Splits the implementation into smaller tasks and identifies dependencies.

### Workflow

User Prompt → Product Planner → Requirements Review → Design Agent → Task Planner → Implementation

### Example

The user requests a travel booking website.

The Product Planner identifies:

- Homepage.
- Destination listings.
- Destination details.
- Booking form.
- Confirmation page.

The Design Agent defines:

- Color palette.
- Typography.
- Responsive layouts.
- Card and button styles.
- Shared navigation and footer.

The Task Planner identifies:

- Shared layout.
- Destination listing.
- Destination details.
- Booking form.
- Validation requirements.

### Engineering concepts

- Agent specialization.
- Structured output contracts.
- Separation of concerns.
- Human-in-the-loop approval.
- Planning and execution boundaries.
- Prompt and workflow versioning.

### Deliverables

- Structured requirements.
- Versioned design specification.
- Dependency-aware task plan.
- Clarification flow for ambiguous requests.
- Optional plan-approval interface.

### Exit criteria

Agents consistently produce machine-readable artifacts that downstream workflow stages can validate and consume.

---

## Phase 4 — Controlled Code Editing and Versioning

**Level:** Intermediate to advanced  
**Goal:** Allow agents to edit existing projects instead of regenerating everything.

### Why this phase matters

Real software engineering involves incremental changes, not repeated full-project generation.

A user might say:

> Make the navigation bar smaller on mobile, but preserve the desktop layout and all existing functionality.

The system should identify relevant files, make a minimal change, test it, and preserve the previous version.

### What we build

- Workspace manager.
- File listing and reading tools.
- Scoped file-editing tools.
- Patch validation.
- Git-based or snapshot-based versioning.
- Diff viewer.
- Rollback support.
- File conflict detection.
- Incremental change planning.

### Proposed workflow

User Edit → Inspect Current Version → Identify Relevant Files → Generate Patch → Validate Patch → Build and Test → Promote Candidate

If validation fails, retain the last known-good version.

### Tool boundaries

Agents should use controlled tools to:

- Read permitted files.
- Search source code.
- Propose file changes.
- Inspect diffs.
- Request builds.
- Read bounded log excerpts.

They should not receive unrestricted access to the host machine.

### Engineering concepts

- Version control.
- Atomic changes.
- File ownership.
- Concurrency control.
- Optimistic locking.
- Change isolation.
- Regression testing.

### Deliverables

- Persistent project history.
- Incremental editing.
- Change summaries.
- Version comparison.
- Reliable rollback.

### Exit criteria

A small requested change modifies only the intended files in normal cases and does not destroy the last known-good version when validation fails.

---

## Phase 5 — Specialized Implementation Agents and Parallel Execution

**Level:** Advanced  
**Goal:** Coordinate multiple implementation agents safely.

### Agents

**Frontend Agent**

Implements pages, components, responsive layouts, and client-side interactions.

**Backend Agent**

Implements APIs, data models, business logic, and persistence integrations when required.

**Integration Stage**

Checks file conflicts, validates API contracts, combines candidate changes, and prepares the project for execution.

The integration stage should primarily use deterministic logic rather than another autonomous agent.

### Hybrid execution model

Independent tasks may run concurrently, while dependent tasks execute sequentially.

Example:

- Frontend Agent implements the product listing.
- Another task implements an independent footer component.
- Backend Agent implements a documented product API.
- Integration checks that the frontend and backend agree on the API contract.

Parallel work is permitted only when dependencies and shared-file ownership are understood.

### What we build

- Task dependency graph.
- Agent-specific tool permissions.
- Explicit API contracts.
- Parallel task execution.
- File conflict detection.
- Integration validation.
- Resource-aware concurrency limits.

### Engineering concepts

- Dependency graphs.
- Concurrent execution.
- Race conditions.
- Conflict resolution.
- Interface contracts.
- Distributed job processing.
- Backpressure and resource limits.

### Deliverables

- Frontend implementation agent.
- Optional backend implementation agent.
- Task scheduler.
- Safe parallel execution.
- Deterministic integration process.

### Exit criteria

Measure sequential and parallel execution on the same benchmark. Parallelism should improve latency without materially increasing integration failures or regressions.

---

## Phase 6 — Automated QA and Self-Repair

**Level:** Advanced  
**Goal:** Verify generated websites through real execution and repair common failures.

### QA Agent responsibilities

- Check required routes.
- Verify navigation and key interactions.
- Run browser tests.
- Inspect console errors.
- Inspect failed network requests.
- Capture screenshots.
- Check mobile and desktop layouts.
- Compare observed behavior with acceptance criteria.

### Repair Agent responsibilities

- Analyze a specific failure.
- Read relevant logs and source excerpts.
- Identify the smallest reasonable correction.
- Apply a scoped patch.
- Return the candidate for revalidation.

### Quality pipeline

Generate → Build → Static Checks → Browser Tests → Visual Checks → Quality Gate

If checks fail:

Classify Failure → Targeted Repair → Rebuild → Re-test

### Testing tools

Playwright should execute browser tests inside the isolated execution environment.

Use deterministic checks for compilation, routes, interactions, and known acceptance criteria. LLM-based review can supplement these checks, but should not replace them.

### Repair policy

- Limit repair attempts.
- Limit model calls and execution time.
- Track failure categories.
- Avoid repeating identical repairs without new evidence.
- Run the failing test again after each patch.
- Preserve the last known-good version.
- Report unresolved defects when the budget is exhausted.

### Engineering concepts

- Automated testing.
- Quality gates.
- Failure classification.
- Regression testing.
- Visual testing.
- Evidence-based repair.
- Bounded autonomous workflows.

### Deliverables

- QA Agent.
- Repair Agent.
- Browser test suite.
- Build and runtime diagnostics.
- Screenshot artifacts.
- Validation reports.

### Exit criteria

Demonstrate that known build and runtime failures are detected and that bounded repair measurably improves the success rate on a fixed test set.

---

## Phase 7 — RAG and Qdrant Knowledge Retrieval

**Level:** Advanced  
**Goal:** Give agents relevant, version-aware technical knowledge.

### Why RAG is needed

The model's built-in knowledge may not reflect the exact framework version, project conventions, or APIs required by the current task.

Qdrant can retrieve relevant documentation and implementation patterns to ground generation in approved sources.

### Knowledge sources

- Official framework documentation.
- Approved component patterns.
- Internal coding conventions.
- Design-system examples.
- Curated project templates.
- Verified solutions to recurring build errors.

Avoid indexing every generated file or conversation indiscriminately.

### Ingestion pipeline

Approved Sources → Parsing → Chunking → Metadata Enrichment → Embeddings → Qdrant

Each document should include useful metadata such as:

- Source.
- Framework.
- Version.
- Content type.
- Update time.
- Access permissions.

### Retrieval pipeline

Agent Task → Focused Query → Metadata Filtering → Vector Search → Optional Reranking → Context Selection → Agent

The indexing and query embedding models must be compatible in vector dimension and semantic space.

### Qdrant's responsibility

Qdrant stores searchable knowledge, not the canonical project state.

Current source files should be retrieved from the workspace or version store. PostgreSQL remains the authoritative source for project and job metadata.

### What we build

- Document ingestion pipeline.
- Embedding integration.
- Qdrant collections.
- Metadata-filtered retrieval.
- Context selection and deduplication.
- Source references.
- Retrieval evaluation.

### Engineering concepts

- Embeddings.
- Vector similarity.
- Metadata filtering.
- Chunking strategies.
- Reranking.
- Retrieval precision and recall.
- Context-window management.
- Data freshness.

### Deliverables

A reusable retrieval service that supplies relevant technical references to the appropriate agents.

### Exit criteria

Compare generation with and without retrieval. Keep RAG in the production path only when evaluation demonstrates a meaningful improvement in quality, reliability, or cost.

---

## Phase 8 — Secure Execution and Production Reliability

**Level:** Advanced to production engineering  
**Goal:** Make it safe to run user-generated applications and recover from infrastructure failures.

This phase is essential before exposing the platform to untrusted users.

### Security boundaries

Separate the control plane from the execution plane.

**Control plane**

- Authentication and authorization.
- Project management.
- Job orchestration.
- Budgets and permissions.
- Audit records.

**Execution plane**

- Temporary workspaces.
- Dependency installation.
- Application builds.
- Browser testing.
- Preview generation.

Generated code must not have unrestricted access to control-plane credentials or internal services.

### Sandbox requirements

- Non-root execution.
- CPU, memory, disk, and process limits.
- Execution timeouts.
- Restricted outbound network access.
- No host credentials or cloud metadata credentials.
- Controlled dependency installation.
- Isolated preview origins.
- Temporary workspace cleanup.
- Resource quotas.
- Stronger isolation, such as microVMs, when warranted by the threat model.

Containers alone are not a guarantee of sufficient isolation for hostile code.

### Reliability requirements

- Durable queue processing.
- Idempotent operations.
- Worker recovery.
- Timeouts and retry policies.
- Cancellation handling.
- Database backups.
- Artifact retention.
- Structured failure statuses.
- Service health checks.

### Engineering concepts

- Threat modeling.
- Least privilege.
- Tenant isolation.
- Idempotency.
- Fault tolerance.
- Queue redelivery.
- Resource isolation.
- Disaster recovery.

### Deliverables

- Hardened execution service.
- Explicit resource limits.
- Authorization tests.
- Failure-recovery procedures.
- Dependency and image scanning.
- Preview isolation.
- Operational runbooks.

### Exit criteria

Demonstrate that hostile or malformed generated code cannot access privileged host credentials, cross tenant boundaries, or run indefinitely without resource controls.

---

## Phase 9 — Observability, Evaluation, and Cost Optimization

**Level:** Production engineering  
**Goal:** Measure system quality and improve it through repeatable experiments.

### Observability

Track the full lifecycle of a generation job:

API Request → LangGraph → Agent Runs → Model Calls → Retrieval → Workspace → Build → Browser Tests → Repair → Preview

Use distributed tracing and structured logs to connect these stages.

### Metrics

Track:

- Generation success rate.
- Build success rate.
- Functional test pass rate.
- Visual check pass rate.
- Time to first preview.
- Total generation latency.
- Queue wait time.
- Model latency and error rate.
- Token usage.
- Estimated cost per job.
- Cost per successful website.
- Average repair attempts.
- Sandbox startup time.
- Regression rate.
- Cancellation rate.

### Evaluation benchmark

Create a versioned collection of prompts covering:

- Landing pages.
- Portfolios.
- E-commerce interfaces.
- Multi-page applications.
- Forms and validation.
- Dashboards.
- Responsive design.
- Accessibility.
- Incremental edits.
- Ambiguous requirements.
- Known build failures.
- Security-sensitive requests.

Each benchmark case should define expected features, required behavior, test steps, and scoring criteria.

### Experiments

Compare:

- Single-agent versus multi-agent generation.
- Sequential versus parallel execution.
- Generation with versus without RAG.
- Different model choices.
- Different repair budgets.
- Full regeneration versus incremental edits.

Use the same benchmark and comparable conditions wherever possible.

### Cost optimization

- Use cheaper models for simple tasks when quality remains acceptable.
- Reduce irrelevant context.
- Cache stable retrieval results when safe.
- Limit repair attempts.
- Avoid unnecessary full-suite testing.
- Enforce model and execution budgets.
- Measure cost per successful project.

### Deliverables

- Observability dashboards.
- Versioned evaluation benchmark.
- Latency and cost reports.
- Regression checks.
- Documented architecture experiments.

### Exit criteria

The team can explain, using measurements, whether an architectural change improved quality, latency, reliability, or cost.

---

## Phase 10 — Deployment, Scaling, and Production Readiness

**Level:** Production-grade engineering  
**Goal:** Operate WebForge AI as a secure, observable, maintainable service.

### Deployment capabilities

- Project export.
- Preview hosting.
- Explicitly authorized public deployment.
- Environment configuration validation.
- Deployment status tracking.
- Rollback to a known-good deployment.
- Secret management.
- Audit history.

Public deployment should be a separate workflow from code generation and require appropriate authorization.

### Scaling architecture

Scale components independently:

- API replicas according to request volume.
- LangGraph workers according to orchestration demand.
- Model concurrency according to provider limits.
- Build runners according to build queue depth.
- Browser workers according to test workload.
- Retrieval infrastructure according to query demand.

Use queue depth, resource saturation, wait time, and failure rate to guide scaling decisions.

### Production engineering

- CI/CD pipelines.
- Automated tests and security scans.
- Database migrations and backups.
- Health and readiness checks.
- Capacity planning.
- Rate limiting and quotas.
- Incident response procedures.
- Recovery testing.
- Monitoring and alerts.
- Data retention and deletion policies.

### Deliverables

- Production deployment pipeline.
- Controlled export and deployment workflow.
- Capacity and cost dashboards.
- Recovery documentation.
- Security and load-test reports.
- Operational support procedures.

### Exit criteria

The system can safely accept requests, recover from expected failures, enforce resource limits, deploy approved applications, and provide enough telemetry to diagnose production incidents.

---

# 4. Complete Multi-Agent Architecture

The final architecture combines the ten phases into one controlled workflow.

```text
                         USER
                          |
                          v
                 API AND AUTHENTICATION
                          |
                          v
                   DURABLE JOB QUEUE
                          |
                          v
                  LANGGRAPH SUPERVISOR
                          |
                          v
                 PRODUCT PLANNING AGENT
                          |
                          v
                    REQUIREMENTS GATE
                          |
                  +-------+-------+
                  |               |
             Clarification      Approved
                  |               |
                  +---- Resume    v
                           DESIGN AGENT
                                 |
                                 v
                            TASK PLANNER
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
              FRONTEND AGENT            BACKEND AGENT
                    |                         |
                    +------------+------------+
                                 |
                                 v
                         INTEGRATION STAGE
                                 |
                                 v
                       VALIDATED CANDIDATE
                                 |
                                 v
                        ISOLATED BUILD RUNNER
                                 |
                                 v
                             BUILD GATE
                                 |
                     +-----------+-----------+
                     |                       |
                   Failed                  Passed
                     |                       |
                     v                       v
               REPAIR AGENT              QA AGENT
                     |                       |
                     +---- Rebuild           v
                                      QUALITY GATE
                                             |
                                  +----------+----------+
                                  |                     |
                                Failed                Passed
                                  |                     |
                                  v                     v
                           Bounded Repair       PREVIEW / EXPORT
                                                        |
                                                        v
                                                     DELIVERY
```

RAG can support planning, implementation, and repair when relevant. It should not be mandatory for every request.

The supervisor coordinates the graph, while deterministic nodes handle validation, execution, state transitions, and resource policies.

---

# 5. Data Architecture

Use each storage system for a specific responsibility.

| System | Data |
|---|---|
| PostgreSQL | Users, projects, jobs, tasks, agent-run metadata, version metadata |
| Qdrant | Embeddings and metadata for approved searchable knowledge |
| Git or snapshot storage | Source history, diffs, rollback references |
| Object storage | Screenshots, logs, export archives, large artifacts |
| LangGraph checkpoint store | Workflow state and resumable execution metadata |
| Redis and job queue | Background job delivery and coordination |
| Temporary runner storage | Files needed during a single build or test execution |

The systems should not compete to become the authoritative source for the same data.

For example, Qdrant should not be the only place where project information exists. Vector records are derived data that can be rebuilt from canonical sources.

---

# 6. API Design

The initial API should support the following operations:

| Endpoint | Purpose |
|---|---|
| `POST /projects` | Create a project |
| `GET /projects/:projectId` | Retrieve authorized project metadata |
| `POST /projects/:projectId/generations` | Start generation or an edit job |
| `GET /jobs/:jobId` | Retrieve job status |
| `POST /jobs/:jobId/cancel` | Request cancellation |
| `GET /projects/:projectId/versions` | List versions |
| `GET /projects/:projectId/files` | List project files |
| `GET /projects/:projectId/diff/:versionId` | Retrieve a version diff |
| `POST /projects/:projectId/rollback` | Request rollback |
| `POST /projects/:projectId/export` | Export the project |
| `POST /projects/:projectId/deployments` | Request an authorized deployment |

Long-running operations should execute asynchronously.

The API creates a durable job and returns its identifier. The frontend receives progress through Server-Sent Events or WebSockets and can fetch the latest durable status after reconnecting.

Every operation must verify project authorization. Job identifiers must not be treated as proof of access.

---

# 7. Core Database Entities

A preliminary relational schema should include:

- `users`
- `projects`
- `conversations`
- `messages`
- `generation_jobs`
- `tasks`
- `agent_runs`
- `project_versions`
- `file_changes`
- `build_runs`
- `test_runs`
- `usage_records`
- `audit_events`

For each entity, define ownership, lifecycle, indexes, authorization rules, and retention before finalizing migrations.

Large artifacts should normally be stored outside PostgreSQL, with references and metadata retained in the relational database.

---

# 8. Testing Strategy

Testing should grow alongside the project.

### Unit testing

Test deterministic functions, schema validation, workflow transitions, budget enforcement, path validation, and authorization rules.

### Integration testing

Test interactions between the graph worker, database, queue, model gateway, Qdrant, workspace manager, and build runner.

### End-to-end testing

Verify the entire journey from user prompt to generated preview and incremental modification.

### Failure-injection testing

Simulate:

- Model timeouts.
- Invalid structured outputs.
- Worker crashes.
- Duplicate queue deliveries.
- Database outages.
- Qdrant unavailability.
- Dependency installation failures.
- Build failures.
- Browser runner crashes.
- Artifact storage errors.
- Cancellation during execution.
- Exhausted repair budgets.

### Security testing

Test cross-tenant access, path traversal, malicious dependencies, network restrictions, secret exposure, resource exhaustion, and preview isolation.

---

# 9. Engineering Principles

The project should follow these principles throughout all ten phases.

1. **Start with a vertical slice.** Prove that a generated website can build and preview before introducing many agents.
2. **Prefer deterministic workflows.** Use LLM reasoning only where it provides value.
3. **Use explicit contracts.** Every agent must have defined inputs, outputs, permissions, and failure behavior.
4. **Validate every boundary.** Treat model output, uploaded content, retrieved documents, and generated code as untrusted.
5. **Keep changes reversible.** Maintain candidate versions and preserve the last known-good project.
6. **Use parallelism selectively.** Parallel execution must respect task dependencies and file ownership.
7. **Bound autonomy.** Enforce time, token, tool, concurrency, and repair limits.
8. **Measure before optimizing.** Use benchmarks to justify more agents, additional retrieval, or more complex orchestration.
9. **Separate control and execution.** Never give generated code unrestricted access to privileged services.
10. **Design for failure.** Every long-running workflow needs explicit recovery and terminal failure states.

---

# 10. Final Success Criteria

WebForge AI is ready for a serious portfolio demonstration when it can:

- Generate a multi-page website from a prompt.
- Produce structured requirements and a coherent design system.
- Coordinate specialized agents through LangGraph.
- Execute independent tasks safely in parallel.
- Edit an existing project incrementally.
- Preserve version history and support rollback.
- Retrieve relevant technical knowledge through Qdrant.
- Build generated code in an isolated environment.
- Run browser tests and detect common failures.
- Attempt bounded, evidence-based repairs.
- Enforce authorization and execution budgets.
- Report build results, test evidence, latency, and cost.
- Recover from expected worker and service failures.
- Export a working project and support a controlled deployment workflow.

## What makes this a strong engineering project?

The value is not the number of agents or technologies used.

The strongest demonstration will show:

- A reliable end-to-end generation pipeline.
- Clear system boundaries and threat modeling.
- Safe multi-agent coordination.
- Measurable improvement from automated repair.
- Reproducible quality evaluation.
- Thoughtful trade-offs between latency, quality, and cost.
- Evidence of reliability under failure conditions.

The objective is to demonstrate production-oriented engineering judgment—not merely to connect several AI APIs.

---

**Recommended starting point:** Complete Phase 1 first. Once one prompt can reliably produce a working preview, add LangGraph state management in Phase 2, and only then introduce the specialized agents in Phase 3.
