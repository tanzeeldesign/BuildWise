# Cursor Step Prompts — Run One at a Time

Use these prompts in Cursor Agent mode after the repository is open. Do not skip the audit.

## Step 1 — Audit only (no edits)

```text
Read 02_CURSOR_MASTER_PROMPT.md and inspect the repository. Do not edit any files yet. Report the actual framework, package manager, relevant scripts, current recommendation/type files and exports, all consumers of buildPlan/getTopic/nextTopicId, existing backend/API routes, and current tests. Compare the code with the contract in the master prompt. Propose a minimal file-by-file implementation plan and list any assumptions or blockers. Stop and wait for approval.
```

## Step 2 — Deterministic recommendation engine

```text
Implement only the deterministic recommendation layer described in the approved plan. Preserve current public types, exported function signatures, topic IDs, and UI contracts. Use the content in reference/topic-catalog.ts as editorial source material, adapting its types to the repository rather than blindly copying it. Keep the existing ranking heuristics and current tie-breaking behavior. Add safe defaults for missing/invalid answers so no text contains undefined/null/unresolved placeholders. Do not add AI, API routes, new screens, dependencies, or UI redesign in this step. Run the relevant typecheck/tests and report results.
```

## Step 3 — Tests

```text
Add tests using the repository's existing test framework. Cover: all six fixed topic IDs; priority and climate mappings; city fallback; multi-priority/tie-breaking behavior as currently implemented; missing answers; invalid/unexpected answer values; placeholder resolution; stable output for identical inputs; BuiltPlan shape; and getTopic/nextTopicId behavior. Do not introduce a new test framework if one already exists. Run tests and typecheck, and report exact commands/results.
```

## Step 4 — Existing UI integration

```text
Trace PlanHub, Guide, FinalPlan, and Profile. Integrate the improved BuiltPlan output only where required to keep existing UI consumers consistent. Do not redesign screens, change navigation, or add new pages. Ensure the app can render a plan with partial answers. Run the app's relevant checks and report changed files.
```

## Step 5 — Optional AI enhancement (only if safe backend exists)

```text
Inspect the existing server-side architecture. If a safe backend/serverless route exists, implement optional AI enhancement behind a feature flag using the provider abstraction appropriate to the repository. Keep deterministic ranking and topic IDs as the source of truth. Use reference/ai-system-prompt.md and reference/ai-output-schema.json as constraints. Validate requests and responses, limit payload size, set a timeout/token limit, handle rate limits/errors, and fall back to the deterministic plan. Keep provider keys server-side only. Do not log user answers or prompts by default. If no backend exists, do not add a public client-side key and do not create a deployment-specific backend; stop and report the smallest safe options for approval.
```

## Step 6 — Final verification

```text
Run the existing lint, typecheck, test, and production build scripts. Fix only issues caused by this change and avoid unrelated refactors. Verify that AI can be disabled and the deterministic plan still works. Report every changed file, all commands run with actual results, required environment variables, deployment steps, and any known limitations. Do not claim success for commands that were not run.
```
