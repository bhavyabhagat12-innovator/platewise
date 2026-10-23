# 🌱 PlateWise — Autonomous Zero-Waste Culinary Planner & Impact Engine

> **PROMPT WAR 2026 Submission** • **Theme:** *Build Beyond AI: Engineer Secure, Intelligent and Autonomous Applications*  
> **Live Demo:** [https://platewise-six.vercel.app/](https://platewise-six.vercel.app/)
> **GitHub Repository:** [https://github.com/bhavyabhagat12-innovator/platewise](https://github.com/bhavyabhagat12-innovator/platewise)

---

## 📌 Executive Summary

* **Project Name:** PlateWise
* **Domain:** Sustainability + Food & Climate Intelligence
* **The Problem:** Urban households discard over **1.3 billion tons** of edible food annually—costing the average household over **$1,500/year** and contributing **8–10% of total global greenhouse gas emissions** (FAO). Most food waste happens not because people don't care, but because shelf-life decay is non-linear, unpredictable, and uncoordinated across multi-day meal planning.
* **The Solution:** PlateWise transcends passive recipe chatbots. It is an **autonomous, tool-augmented culinary agent** that mathematically calculates spoilage hazard risk curves, executes empirical climate and financial valuation tools, leverages **Google Gemini Flash** to synthesize an optimized 3-day sequential *"Use-It-First"* rescue plan, requires **human-in-the-loop confirmation**, and features a bulletproof offline heuristic failover.

---

## 📸 Interface & Live Telemetry

```
+-----------------------------------------------------------------------------------------+
|  [🌱 PlateWise AI AGENT]          Problem  Live Agent  Architecture  Impact  Security   |
|  Status: [● Gemini Flash Online]                                      [🌙 Dark/Light]   |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|       Autonomous Zero-Waste Dining. Engineered Before Food Spoils.                      |
|       [ 1.3B Tons Wasted ]    [ $1,500/yr Lost ]    [ 10% GHG ]    [ < 850ms Latency ]  |
|                                                                                         |
|  +-------------------------------------+   +-----------------------------------------+  |
|  | PANTRY INVENTORY                    |   | AGENT REASONING TRACE (Live Autonomy)   |  |
|  | * Baby Spinach    (1 day left)  [🚨]|   | [✓] 1. Input Sanitization & Whitelist   |  |
|  | * Ground Turkey   (1 day left)  [🚨]|   | [✓] 2. Tool: Spoilage Decay Curve       |  |
|  | * Heavy Cream     (2 days left) [⚠️]|   | [✓] 3. Tool: Avoided CO2e & $ Valuation |  |
|  | * Artisan Bread   (2 days left) [⚠️]|   | [✓] 4. Gemini Flash JSON Synthesis      |  |
|  |                                     |   | [✓] 5. Human-In-The-Loop Verification   |  |
|  | [+ Add Custom Item] [Quick Presets] |   |                                         |  |
|  | [▶ Run Autonomous Waste Agent]      |   | [✅ Approve & Activate Rescue Plan]     |  |
|  +-------------------------------------+   +-----------------------------------------+  |
|                                                                                         |
|  AUDITED IMPACT METRICS & REAL-TIME SPOILAGE CHART                                      |
|  [ 1.60 kg Rescued ]   [ $16.80 Saved ]   [ 8.42 kg CO2e Avoided ]   [ 96% Confidence ] |
+-----------------------------------------------------------------------------------------+
```

---

## ⚡ Key Features

1. **Agentic Reasoning Trace:** Displays live, animated multi-step autonomous execution (Sanitization → Risk Scoring → Impact Valuation → Model Synthesis → Safety Verification).
2. **Deterministic Code Tools:** Computes non-linear spoilage hazard curves and empirical greenhouse gas emissions (FAO emission factors) *before* invoking generative intelligence.
3. **Structured JSON Output:** Uses Gemini Flash's `responseMimeType: "application/json"` with schema adherence for guaranteed structured output.
4. **Human-In-The-Loop Guardrail:** Agent proposals require user confirmation before final execution, preventing unintended kitchen actions.
5. **Explainability & Decision Audit Modal:** Full mathematical transparency disclosing exact decay equations, category weight multipliers, and agent decision logic.
6. **Session Run History:** LocalStorage persistence enabling users and judges to inspect, compare, and restore previous meal rescue plans.
7. **Multi-Format Export Engine:** 1-click download of timestamped sustainability certificates (`.txt`/`.md`) or clean, publication-ready Print-to-PDF reports.
8. **Live Telemetry Ribbon:** Real-time roundtrip latency tracker, execution ID token, and engine state monitoring.
9. **Zero-Crash Offline Fallback:** Graceful failover to local deterministic heuristics if the API key is unconfigured or rate limits are reached.

---

## 🧠 How The Agent Works

PlateWise follows a strict **Plan → Tool → Reason → Verify → Confirm** agentic loop:

1. **Ingest & Sanitize:** User inputs are validated, bounded by string length, and mapped against an allowed food category taxonomy.
2. **Deterministic Tool Execution:**
   - **Spoilage Hazard Tool:** Models decay using an exponential curve:  
     $$\text{Risk} = \min\left(100, \text{BaseUrgency}(\text{days}) \times \frac{\text{PerishabilityRisk}}{1.2}\right)$$
   - **Environmental Valuation Tool:** Multiplies category weights against standard carbon intensities (e.g. Meat: 14.8 kg CO₂e/kg, Dairy: 3.2 kg CO₂e/kg) and average retail grocery valuations.
3. **Gemini Flash Synthesis:** The agent passes structured calculations to Google Gemini Flash with system instructions commanding rigid JSON generation and complete prompt-injection isolation.
4. **Human-in-the-Loop Audit:** Confidence scores are surfaced; the user must explicitly approve the proposal before the meal schedule is rendered.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Generative AI** | Google Gemini Flash (`gemini-1.5-flash`) | Ultra-fast inference (<850ms), native JSON structured output, cost efficiency. |
| **Backend & Compute** | Vercel Serverless Functions (Node.js ESM) | Stateless, zero server maintenance, secure environment variable isolation. |
| **Frontend UI** | HTML5, Modern CSS3, Vanilla ES6+ | Zero heavy framework bloat, 90+ Lighthouse score, fast time-to-interactive. |
| **Styling & Motion** | Custom CSS Design System, Google Fonts | Responsive fluid typography (*Plus Jakarta Sans*, *JetBrains Mono*), CSS variables, prefers-reduced-motion support. |
| **Security** | Content Security Policy, Helmet-style Headers | Zero client API key leaks, strict XSS escaping, sliding IP rate limiting. |

---

## 🔐 Environment Variables

Create a `.env` file in the project root for local testing (do **NOT** commit this to version control):

```env
# Google AI Studio API Key (Required for live Gemini calls)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere1234567890

# Model Override (Optional, defaults to gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash
```

> **Note:** If `GEMINI_API_KEY` is not present, PlateWise automatically engages **Deterministic Demonstration Mode**, guaranteeing judges can evaluate 100% of the UI and algorithmic features without crashing.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
* A modern web browser (Chrome, Edge, Firefox, Safari).
* Optional: Node.js (v18+) if running a local Node server or Vercel CLI.

### Option A: Static Preview (Instant)
Simply open `index.html` in any web browser. The app will automatically run in verified offline demonstration mode.

### Option B: Local Serverless Simulation via Vercel CLI
```bash
# 1. Clone repository
git clone https://github.com/your-username/platewise.git
cd platewise

# 2. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 3. Create .env file with your Gemini API key
copy .env.example .env

# 4. Start local development server
vercel dev
```

---

## 🧪 Automated Testing & CI/CD

PlateWise includes an automated test suite containing **33 unit and integration tests** built using Node.js's native test runner (`node:test` and `node:assert`).

```bash
# Run all automated tests
npm test

# Run syntax and code quality checks
npm run lint
```

* **Zero Mocking Overhead:** All Gemini API interactions are mocked via pure function injection; tests require **zero API keys** and execute offline.
* **Edge-Case Coverage:** Thoroughly tests empty arrays, oversized batches, prompt-injection sequences, non-linear decay curves, category weighting, rate limiters, and offline fallback failover.
* **Continuous Integration:** Automated on every push via GitHub Actions ([`.github/workflows/test.yml`](.github/workflows/test.yml)).
* **Detailed Guide:** See [`docs/TESTING.md`](docs/TESTING.md) for full test specifications.

---

## 📂 Project Structure

```
platewise-ai/
├── .github/
│   └── workflows/
│       └── test.yml       # GitHub Actions CI matrix workflow (Node 18, 20, 22)
├── .env.example           # Placeholder environment file
├── .eslintrc.json         # ESLint code quality configuration
├── .gitignore             # Git ignore file protecting .env and node_modules
├── index.html             # High-performance, accessible single-page interface
├── style.css              # Custom responsive design system & dark/light theme
├── script.js              # Client state controller, telemetry, & XSS-safe renderer
├── package.json           # Node ESM configuration & test/lint scripts
├── vercel.json            # Vercel deployment config & strict CSP security headers
├── LICENSE                # MIT License
├── api/
│   └── analyze.js         # Vercel serverless function (HTTP boundary & orchestration)
├── lib/                   # Pure modular libraries (100% unit-tested)
│   ├── config.js          # Central configuration & magic numbers
│   ├── validation.js      # Input sanitization, bounds checking, injection defense
│   ├── scoring.js         # Spoilage decay curves & carbon/financial accounting
│   ├── rate-limiter.js    # Sliding-window IP rate limiter
│   ├── schema-validator.js# Model JSON extraction & schema validation
│   └── fallback.js        # Deterministic offline demonstration heuristics
├── tests/                 # Automated test suite (33 tests, node:test)
│   ├── validation.test.js
│   ├── scoring.test.js
│   ├── rate-limiter.test.js
│   ├── schema-validator.test.js
│   └── agent-integration.test.js
└── docs/                  # Detailed submission documentation
    ├── ARCHITECTURE.md    # Mermaid sequence diagram & architectural decisions
    ├── SECURITY.md        # Comprehensive security guardrails & threat mitigations
    ├── TESTING.md         # Complete test suite guide & coverage breakdown
    ├── EVALUATION.md      # Judging criteria mapping matrix
    └── DISCLOSURE.md      # Open-source and AI tool usage disclosures
```

---

## ⚠️ Limitations & Future Scope

### Current Limitations
* Does not connect directly to grocery store loyalty APIs or commercial barcode scanners (requires manual text selection or preset click).
* Recipe generation is limited to standard 3-day sequential windows to remain well within free-tier serverless execution timeouts.

### Future Scope
* **Computer Vision Pantry Audit:** Integration with Gemini Multimodal Vision to photograph a refrigerator shelf and auto-populate inventory.
* **Smart Refrigerator IoT Webhooks:** Direct telemetry sync with smart kitchen appliances.
* **Neighborhood Food Share Integration:** Option to push unconsumed Day-3 items to local community food pantries (Olio / Too Good To Go integration).

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
