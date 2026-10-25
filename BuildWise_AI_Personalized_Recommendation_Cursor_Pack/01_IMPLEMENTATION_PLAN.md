# BuildWise AI Personalized Recommendations — Implementation Plan

## Goal

Turn the existing onboarding answers into a useful, tailored home-planning plan for Pakistani homeowners. Keep the experience calm, premium, practical, and easy to scan. The existing app remains the product; this work improves recommendation logic and content, rather than redesigning it.

## Product behavior

1. The user completes the existing questionnaire.
2. `buildPlan(answers)` normalizes incomplete answers and creates a profile summary.
3. The recommendation engine ranks the six existing topics using the current rules.
4. Each topic receives concise content personalized with the user's selected location, climate, plot size, household, outdoor habits, future needs, style, and priorities.
5. The Plan Hub shows the leading recommendation and topic cards.
6. Guide detail pages show the selected topic's explanation, discussion points, and tip.
7. Final Plan/Profile use the same `BuiltPlan` output so content stays consistent.
8. If AI is enabled, the server may generate a short explanation for the top recommendation or improve phrasing. The UI must still work when AI is disabled, unavailable, rate-limited, invalid, or slow.

## Existing contract to preserve

```ts
type Answers = {
  project?: string;
  location?: string;
  plot?: string;
  climate?: string;
  family?: string;
  outdoor?: string;
  future?: string;
  style?: string;
  priorities?: string[]; // max 3
};

type TopicId =
  | "orientation"
  | "ventilation"
  | "sunlight"
  | "materials"
  | "spatial"
  | "design-direction";

type TopicContent = {
  id: TopicId;
  number: string;
  title: string;
  cardTitle: string;
  blurb: string;
  label: string;
  hero: string;
  why: string;
  discuss: string[];
  tip: string;
  planLabel: string;
};

type BuiltPlan = {
  greetingName: string;
  profileStrip: string;
  profileRows: Array<[string, string]>;
  topTopicId: TopicId;
  topTitle: string;
  topSummary: string;
  topics: TopicContent[];
  discussList: string[];
  planText: string;
};
```

The catalog may store `heroTemplate` and `whyTemplate`, but the public `TopicContent` returned to UI consumers should continue to provide `hero` and `why`.

## Phases

### Phase 1 — Repository audit (no edits)
- Find the actual type definitions and recommendation functions.
- Trace all consumers of `buildPlan`, `getTopic`, and `nextTopicId`.
- Identify the framework, package manager, tests, lint/typecheck scripts, and any existing server/API layer.
- Report any mismatch between the supplied contract and repository.
- Do not guess file structure or rewrite the app.

### Phase 2 — Reliable deterministic engine
- Preserve the public types and exported function signatures.
- Normalize missing or invalid values safely.
- Keep the six fixed topic IDs.
- Keep current ranking heuristics unless there is a clear bug.
- Personalize copy with safe placeholder fallbacks.
- Keep copy short, useful, non-repetitive, and suitable for Pakistan.
- Ensure all returned fields are populated and arrays have the expected shape.
- Keep a deterministic result for identical answers.

### Phase 3 — Shared content catalog
- Store topic copy in one catalog.
- Convert `heroTemplate` and `whyTemplate` into `hero` and `why` in the output.
- Escape or safely handle unexpected user strings if they can enter the answer model.
- Do not pass arbitrary free text into a provider prompt unless explicitly required.

### Phase 4 — Optional AI enhancement, only if architecture supports it safely
- First inspect whether a backend/serverless API route already exists.
- If there is a backend, add a provider adapter there.
- If there is no server-side execution environment, do not put a secret in frontend code. Either leave AI disabled with a clear extension point or ask the project owner before introducing a deployment-specific backend.
- Send only the minimum answer fields needed for the recommendation.
- Validate the request and the AI response.
- Constrain the model to the existing topic IDs and content schema.
- Never let the AI choose new topic IDs or override deterministic ranking.
- Use a timeout, reasonable token limit, and error handling.
- If AI fails, return the deterministic plan without breaking the page.
- Do not store prompts or homeowner answers in logs by default.

### Phase 5 — UI integration without redesign
- Use existing PlanHub, Guide, FinalPlan, and Profile consumers.
- Do not create new screens or change navigation.
- Keep loading/error states minimal and aligned with existing components.
- Do not block the plan on AI. If asynchronous enhancement is used, show the deterministic plan first.

### Phase 6 — Tests and verification
- Unit-test ranking and personalization.
- Test missing and invalid answers.
- Test that no new topic IDs are introduced.
- Test AI response validation and fallback if an AI endpoint is implemented.
- Run the repository's existing lint, typecheck, test, and build scripts.
- Report exact commands and results; do not claim tests passed unless they were run.

## Ranking rules supplied for the current prototype

Priority → topic:
- Natural light → `sunlight`
- Ventilation → `ventilation`
- Energy efficiency → `ventilation`
- Privacy → `spatial`
- Space → `spatial`
- Aesthetics → `design-direction`

Climate → topic:
- Intense heat → `ventilation`
- Humidity → `ventilation`
- Monsoon rains → `materials`
- Dust & haze → `materials`
- Mild seasons → `orientation`

City fallback if there is no priority/climate match:
- Karachi → `ventilation`
- Lahore → `orientation`
- Islamabad → `sunlight`
- Other/default → `orientation`

If current code has a different tie-breaking or multi-topic ranking behavior, preserve it unless it is demonstrably broken. Do not silently replace it with a new algorithm.

## Definition of done

- Existing screens and navigation still work.
- Existing exported types/functions remain compatible.
- The plan is personalized from answer data.
- The same answers produce the same deterministic plan.
- Missing answers do not cause `undefined` text or runtime errors.
- AI is optional and can never prevent a plan from rendering.
- No provider secret is bundled into client code.
- All validation commands and known limitations are documented.
