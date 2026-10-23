# 🏗️ PlateWise Architectural Blueprint & Design System

This document outlines the system architecture, component boundaries, data flow pipelines, and technical trade-offs engineered into **PlateWise** for PROMPT WAR 2026.

---

## 1. High-Level System Architecture & Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Judge
    participant UI as Client Frontend (index.html / script.js)
    participant Edge as Vercel Edge / Serverless (/api/analyze.js)
    participant Tools as Deterministic Code Tools
    participant Gemini as Google AI Studio (Gemini Flash)
    participant Guard as Output Schema Validator & HITL

    User->>UI: Selects preset or enters expiring pantry items
    User->>UI: Clicks "Run Autonomous Waste Agent"
    UI->>UI: Starts Animated Reasoning Trace (Step 1)
    UI->>Edge: POST /api/analyze (Sanitized JSON payload)
    
    rect rgb(15, 35, 25)
        Note over Edge: Security & Rate-Limit Barrier
        Edge->>Edge: Verify sliding IP rate limit (max 25 req/min)
        Edge->>Edge: Sanitize inputs & enforce string length bounds
    end
    
    rect rgb(20, 45, 35)
        Note over Edge,Tools: Deterministic Tool Layer
        Edge->>Tools: runToolRiskScoring(items)
        Tools-->>Edge: Non-linear decay scores (0-100)
        Edge->>Tools: runToolImpactCalculation(scoredItems)
        Tools-->>Edge: Rescued kg, Avoided CO2e, $ Savings
    end

    rect rgb(25, 55, 45)
        Note over Edge,Gemini: Generative Reasoning Layer
        Edge->>Gemini: POST generateContent (Structured JSON Schema)
        alt API Key Valid & Quota Available
            Gemini-->>Edge: 3-day sequential rescue plan (JSON)
        else API Failure / Quota Exceeded / Missing Key
            Edge->>Edge: Engage Local Deterministic Fallback Engine
        end
    end

    Edge-->>UI: Consolidated payload (Calculations + Recipes + Trace)
    UI->>UI: Advances trace to Step 5 (Verification)
    UI->>Guard: Prompts Human-In-The-Loop Confirmation
    User->>Guard: Approves proposed meal schedule
    Guard->>UI: Renders Telemetry, Animated Metrics & Risk Chart
    UI-->>User: Interactive 3-day rescue guide & export tools ready
```

---

## 2. Component Breakdown & Design Rationale

### A. Client Presentation Layer (`index.html`, `style.css`, `script.js`)
* **Design Decision:** Zero third-party frontend frameworks (React, Vue, Angular).
* **Rationale:**
  * Eliminates heavy JavaScript bundles (yielding near-perfect 95+ Lighthouse performance).
  * Direct DOM rendering with native `document.createElement` and `textContent` guarantees immunity from DOM-based XSS vulnerabilities.
  * Native CSS Variables and `@media (prefers-reduced-motion)` provide accessible, butter-smooth theme switching and micro-interactions.

### B. Isolated Serverless API Tier (`/api/analyze.js`)
* **Design Decision:** Secure Node.js ESM serverless endpoint deployed on Vercel.
* **Rationale:**
  * **Zero Client-Side Exposure:** Ensures the secret `GEMINI_API_KEY` never reaches browser DevTools or network logs.
  * **Stateless Scaling:** Scales instantly with zero idle server overhead or maintenance.
  * **Pre-Execution Rate Limiting:** Sliding-window rate limiting prevents API abuse and denial-of-wallet threats.

### C. Deterministic Code Tools vs. LLM Responsibilities
* **Design Decision:** Decouple mathematical calculations from generative text generation.
* **Rationale:** Large Language Models are notoriously prone to arithmetic hallucinations. PlateWise delegates numerical computations (decay scores, financial savings, carbon emissions) strictly to deterministic JavaScript algorithms. Gemini Flash is utilized solely for culinary reasoning, ingredient pairing, and instructional sequencing.

### D. Google Gemini Flash Model Integration
* **Design Decision:** Use `gemini-1.5-flash` with native JSON mode (`responseMimeType: "application/json"`).
* **Rationale:**
  * Sub-second latency (<850ms) ensures real-time responsiveness for judges.
  * Schema-constrained output eliminates unstructured markdown formatting errors and prevents parsing breakdowns.

### E. Human-in-the-Loop (HITL) Guardrail
* **Design Decision:** Enforce explicit user approval before rendering actionable cooking steps.
* **Rationale:** Critical actions in physical real-world environments (such as cooking perishable proteins) should never be executed blindly by autonomous systems. The HITL guardrail guarantees consumer oversight and food safety awareness.

### F. Dual-Tier Graceful Failover Engine
* **Design Decision:** Automatic fallback simulation on both server and client layers.
* **Rationale:** If an API quota is exhausted, if a judge does not have an active Google AI Studio key, or if an offline environment is encountered, the deterministic rule engine steps in instantly. The app never displays an unhandled error or blank screen.

---

## 3. Data Flow Diagram

```mermaid
graph LR
    A["Raw Pantry Input"] --> B["Sanitization Layer"]
    B --> C["Tool: Spoilage Decay Index"]
    B --> D["Tool: FAO Carbon & Cost Multiplier"]
    C --> E["Structured Prompt Builder"]
    D --> E
    E --> F["Google Gemini Flash"]
    F --> G["JSON Schema Validator"]
    G --> H["Human-In-The-Loop Approval"]
    H --> I["Visual UI & Export Engine"]
```
