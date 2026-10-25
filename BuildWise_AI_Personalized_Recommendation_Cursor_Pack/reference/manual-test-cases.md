# Manual Test Cases

These are behavior checks, not hardcoded expected full paragraphs. Existing multi-priority tie-breaking should remain as implemented in the repository.

## Case 1 — Heat + ventilation priority
```json
{
  "project": "Build a new home",
  "location": "Karachi",
  "plot": "5–10 marla",
  "climate": "Intense heat",
  "family": "3–5 people",
  "outdoor": "On weekends",
  "future": "Working from home",
  "style": "Modern",
  "priorities": ["Ventilation", "Energy efficiency"]
}
```
Expected checks:
- Plan builds without error.
- `ventilation` is a valid leading candidate under the current rules.
- Copy includes supplied values only where relevant.
- No exact wind direction or cooling savings are invented.

## Case 2 — Monsoon + materials
```json
{
  "project": "Renovate",
  "location": "Lahore",
  "plot": "10–20 marla",
  "climate": "Monsoon rains",
  "family": "6+ people",
  "outdoor": "Every day",
  "future": "Parents moving in",
  "style": "Traditional",
  "priorities": ["Privacy", "Space"]
}
```
Expected checks:
- `materials` is selected by the climate mapping when no higher-ranked priority takes precedence, according to the existing algorithm.
- If privacy/space takes precedence under current ranking, preserve that existing behavior.
- Discussion prompts mention drainage/waterproofing as items to review, not guaranteed solutions.

## Case 3 — Natural light
```json
{
  "project": "Redesign",
  "location": "Islamabad",
  "plot": "1 kanal or more",
  "climate": "Mild seasons",
  "family": "1–2 people",
  "outdoor": "Occasionally",
  "future": "No major changes",
  "style": "Minimal",
  "priorities": ["Natural light"]
}
```
Expected checks:
- `sunlight` is selected by the explicit priority mapping.
- The explanation balances daylight with glare, heat, and privacy.
- No claim is made about exact orientation.

## Case 4 — Partial answers
```json
{
  "location": "Other",
  "priorities": []
}
```
Expected checks:
- Plan builds without crashing.
- No `undefined`, `null`, or unresolved `{location}` style placeholder appears.
- Defaults are human-readable and do not pretend to know the missing answers.

## Case 5 — Unexpected values
```json
{
  "location": "Atlantis",
  "climate": "Snowstorms",
  "style": "Space-age",
  "priorities": ["Unlisted priority", "Natural light", "Natural light", "Ventilation", "Space"]
}
```
Expected checks:
- Invalid values are normalized/ignored safely.
- Priorities are capped at three unique valid options.
- No invalid topic ID is returned.
- The app does not throw.

## Case 6 — Optional AI failure
Simulate provider timeout, HTTP 429, malformed JSON, invalid schema, and missing API key.
Expected checks:
- Deterministic plan still renders.
- No provider secret is exposed.
- No raw homeowner answers are printed to logs.
- User sees no fatal error or blank plan.

## Case 7 — Repeatability
Call `buildPlan` twice with the same valid answer object.
Expected checks:
- Same top topic, same topic ordering, and same text.
