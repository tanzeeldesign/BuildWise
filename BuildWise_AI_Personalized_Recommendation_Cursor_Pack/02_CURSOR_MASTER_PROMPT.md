# Cursor Master Prompt — BuildWise Personalized Recommendations

You are working inside an existing app called BuildWise, a premium, minimal, editorial-style home-planning experience for Pakistani homeowners.

Your task is to implement and improve the personalized recommendation feature in the existing repository. This is a codebase modification task, not a greenfield rebuild.

## First: inspect, then implement in small stages

Before editing, inspect the repository and report:
1. Framework, package manager, and relevant scripts.
2. Exact current contents/exports of `src/features/buildwise/types.ts` and `src/features/buildwise/recommendations.ts`.
3. Where `buildPlan`, `getTopic`, `nextTopicId`, `BuiltPlan`, and `TopicContent` are consumed, including PlanHub, Guide, FinalPlan, and Profile.
4. Existing API/backend/serverless routes, if any.
5. Current tests and any build/type errors.
6. Any differences between the repository and the contract below.

Do not edit files during this audit. Wait for me to approve the implementation plan.

## Source of truth and compatibility

The intended source-of-truth files are:
- `src/features/buildwise/types.ts`
- `src/features/buildwise/recommendations.ts`

The UI consumers include PlanHub cards, Guide detail, and FinalPlan/Profile summaries.

Intended `Answers` contract:

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
```

Allowed values:
- project: `Build a new home`, `Renovate`, `Redesign`
- location: `Karachi`, `Lahore`, `Islamabad`, `Other`
- plot: `Under 5 marla`, `5–10 marla`, `10–20 marla`, `1 kanal or more`
- climate: `Intense heat`, `Humidity`, `Monsoon rains`, `Dust & haze`, `Mild seasons`
- family: `1–2 people`, `3–5 people`, `6+ people`
- outdoor: `Every day`, `On weekends`, `Occasionally`
- future: `A growing family`, `Working from home`, `Parents moving in`, `No major changes`
- style: `Modern`, `Traditional`, `Minimal`, `Cultural`
- priorities: at most 3 values from `Natural light`, `Ventilation`, `Energy efficiency`, `Privacy`, `Space`, `Aesthetics`

Fixed topic IDs — do not add or rename:
- `orientation`
- `ventilation`
- `sunlight`
- `materials`
- `spatial`
- `design-direction`

Intended `TopicContent` shape:

```ts
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
```

The catalog can use `heroTemplate` and `whyTemplate` internally, but returned `TopicContent` must use `hero` and `why`.

Intended `BuiltPlan` shape:

```ts
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

Current helper signatures:
- `buildPlan(answers: Answers): BuiltPlan`
- `getTopic(id, answers): TopicContent`
- `nextTopicId(current, plan)`

If actual types differ, do not blindly overwrite them. Explain the difference and adapt while preserving compatibility.

## Recommendation behavior

Keep these current ranking heuristics unless the existing code has a clear bug:
- Natural light → sunlight
- Ventilation → ventilation
- Energy efficiency → ventilation
- Privacy → spatial
- Space → spatial
- Aesthetics → design-direction
- Intense heat → ventilation
- Humidity → ventilation
- Monsoon rains → materials
- Dust & haze → materials
- Mild seasons → orientation
- City fallback: Karachi → ventilation; Lahore → orientation; Islamabad → sunlight; Other/default → orientation

Do not invent a new topic ID, recommendation category, screen, schema, or database.

## Product and content principles

- Premium, calm, concise, editorial tone.
- Pakistan residential context, but do not stereotype cities or assume exact site conditions.
- Recommendations are planning prompts, not architectural/structural/MEP engineering advice.
- Never invent code compliance, approval requirements, exact costs, material performance guarantees, structural dimensions, or engineering specifications.
- Clearly frame uncertain or site-dependent details as questions to review with a qualified local architect/engineer.
- Keep topic cards scannable. Avoid repeated generic copy.
- Missing answers should have graceful defaults; never render `undefined`, `null`, or literal unresolved placeholders.
- Identical answers must yield the same deterministic output.

## AI architecture and security

Build a reliable deterministic recommendation engine first. It must work offline and without any API key.

AI is an optional enhancement, not the source of truth:
- Deterministic logic owns ranking and topic IDs.
- AI may help explain/rephrase the already-selected recommendation, but may not create new topic IDs or change the ranking.
- Validate all input and model output.
- Use an existing backend/serverless route if present.
- If no backend exists, do not put secrets in client code or public environment variables. Do not create a deployment-specific backend without first presenting the options and asking for approval.
- Never expose API keys in frontend bundles.
- Include timeout/error handling and fall back to the deterministic plan.
- Avoid logging homeowner answers or prompts by default.
- Use a constrained prompt and schema. See `reference/ai-system-prompt.md` and `reference/ai-output-schema.json`.

## Scope restrictions

- Do not redesign existing UI.
- Do not add screens.
- Do not replace the app's state management.
- Do not change route names or navigation.
- Do not add a database.
- Do not add AI training or fine-tuning.
- Do not add live weather or other live data.
- Do not add dependencies unless needed and approved.
- Do not remove working behavior just to simplify implementation.
- Do not claim tests pass unless you actually run them.

## Implementation sequence

After I approve your audit:
1. Improve the deterministic catalog and personalization while preserving types and function signatures.
2. Add/adjust tests using the existing test framework.
3. Integrate the output into existing consumers only where necessary; no redesign.
4. If safe server-side infrastructure exists, implement optional AI enhancement behind a feature flag. If not, leave it disabled and report the minimal backend option needed.
5. Run lint, typecheck, tests, and build using the repository's actual scripts.
6. Summarize changed files, behavior, environment variables, test results, and any remaining setup.

Use the step prompts in `03_CURSOR_STEP_PROMPTS.md` one at a time. Do not attempt all stages in one giant change.
