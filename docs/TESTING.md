# 🧪 Automated Test Suite & Quality Verification

PlateWise features an automated test suite built with Node.js's native test runner (`node:test` and `node:assert`). It contains **33 automated unit and integration tests** executing in under **250ms** with **zero external test dependencies**.

---

## 1. Running The Tests Locally

Execute the test suite with standard npm:

```bash
npm test
```

Or invoke Node's test runner directly:

```bash
node --test tests/**/*.test.js
```

To run syntax and code quality checks:

```bash
npm run lint
```

---

## 2. Test Coverage & Structure

The test suite is organized into 5 focused modules within the [`/tests`](../tests) directory:

```
tests/
├── validation.test.js        # 13 tests: Inputs, bounds, sanitization, prompt injection
├── scoring.test.js           # 6 tests: Spoilage hazard curves, FAO emissions, $ savings
├── rate-limiter.test.js      # 4 tests: Sliding-window rate limiting & IP isolation
├── schema-validator.test.js  # 5 tests: Markdown backtick stripping, JSON schema checks
└── agent-integration.test.js # 5 tests: Mocked Gemini API, network failovers, fallback mode
```

### Detailed Test Specifications

| Test Suite | Spec # | Behavior Verified |
| :--- | :--- | :--- |
| **Validation & Sanitization** | 1 | Validates normal multi-item ingredient batches. |
| | 2 | Rejects empty ingredient arrays with descriptive error. |
| | 3 | Rejects null or non-array inputs. |
| | 4 | Rejects oversized batches exceeding 25 ingredients. |
| | 5 | **Prompt Injection Defense:** Strips brackets, `<script>`, and system override syntax. |
| | 6 | Truncates overlong item names to 50 characters. |
| | 7 | Filters out empty or whitespace-only names. |
| | 8 | **Expiry Edge Case:** Handles 0 days left (expired today) with maximum base hazard. |
| | 9 | **Expiry Edge Case:** Clamps negative days to 0. |
| | 10 | **Expiry Edge Case:** Clamps far-future expiry (>365 days) to upper bound. |
| | 11 | Whitelists categories (`produce`, `dairy`, `meat`, `bakery`, `pantry`), defaulting safely. |
| | 12 | Clamps quantities between 1 and 50 servings. |
| | 13 | Sanitizes dietary notes and strips injection characters. |
| **Scoring & Impact Tools** | 14 | Computes non-linear decay curve (98 at 0d down to 10 at 30d). |
| | 15 | Automatically sorts scored items in descending order of spoilage hazard. |
| | 16 | Applies perishability multipliers (Meat 1.70x > Dairy 1.55x > Produce 1.35x > Pantry 0.8x). |
| | 17 | Assigns urgency tags (`Critical`, `High`, `Moderate`, `Low`). |
| | 18 | Computes empirical avoided CO₂e (kg) and grocery savings ($) using FAO factors. |
| | 19 | Handles empty arrays returning zeroed metric summaries. |
| **Rate Limiter** | 20 | Allows requests within sliding window threshold. |
| | 21 | Rejects requests exceeding threshold with rate-limit flag. |
| | 22 | Resets count automatically after window duration expires. |
| | 23 | Tracks and isolates rate counts across distinct client IP addresses. |
| **Schema Validator** | 24 | Strips markdown code fences (```` ```json ... ``` ````) from model outputs. |
| | 25 | Parses bare JSON outputs cleanly. |
| | 26 | Validates conforming 3-day sequential rescue plan schema. |
| | 27 | Rejects model payloads missing `day_by_day_plan`. |
| | 28 | Rejects null, non-object, and string payloads. |
| **Agent Integration & Mocks** | 29 | Generates complete deterministic fallback plan with recipes and storage hacks. |
| | 30 | Engages fallback mode automatically when `GEMINI_API_KEY` is missing or empty. |
| | 31 | Gracefully switches to fallback mode when Gemini API returns HTTP 429 (Rate Limit) or 500. |
| | 32 | **Mocked Gemini Flash Call:** Parses structured JSON response and builds full audit trace. |
| | 33 | Catches network socket errors/exceptions and recovers safely to local heuristics. |

---

## 3. Mocking Strategy (Zero Network Dependencies)

In accordance with competition rules, automated tests **never** make live network requests and **never** require real API keys:
* Test suites inject a mock `fetchFn` into `processAgentAnalysis`.
* Network latency, rate limit errors (`HTTP 429`), server errors (`HTTP 500`), and connection resets are simulated deterministically.
* Tests run reliably in sandboxed environments and offline CI runners.

---

## 4. Continuous Integration (GitHub Actions)

Every pull request and push to `main` triggers the automated CI workflow defined in [`.github/workflows/test.yml`](../.github/workflows/test.yml):

* Matrix builds across **Node 18.x, 20.x, and 22.x**.
* Executes `npm test` across all platforms.
* Guarantees that no regressions, syntax errors, or prompt injection vulnerabilities are introduced.
