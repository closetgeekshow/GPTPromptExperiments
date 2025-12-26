# Inferring Relevant Experts from Input

**Purpose**: This article documents a set of prompt‑engineering techniques for directing a language model to *evaluate an input and infer which kinds of experts would provide useful context*. These patterns are intended for use in analysis pipelines, agent systems, design reviews, and research workflows.

The goal is **not** roleplay for its own sake, but *selective and diverse expertise*: identifying a small, well‑balanced set of perspectives that materially reduce uncertainty, risk, or blind spots **without drifting into hyper‑specialized or redundant roles**.

---

## Why This Matters

Language models are generalists. They benefit most when we:

* Explicitly surface **knowledge gaps**
* Identify **risk‑bearing assumptions**
* Route analysis to the *right kinds of expertise*
* Ensure **perspective diversity**, not just technical depth

Treating expert inference as a first‑class step improves:

* Output quality
* Cost control (fewer unnecessary perspectives)
* Determinism in multi‑agent systems
* Resilience against single‑discipline bias

---

## Guiding Principle: Favor Diverse, Generalist‑Level Expertise

When inferring experts, prefer **broad, discipline‑level roles** over narrow, tool‑ or technology‑specific ones.

### Prefer

* “Backend Architect” over “PostgreSQL Query Planner Specialist”
* “UX Researcher” over “Figma Auto‑Layout Expert”
* “Data Architect” over “Vector Index Tuning Engineer”

### Avoid

* Roles tied to a single library, vendor, or implementation detail
* Overlapping experts that answer the same class of questions
* Deep specialists unless a *specific, high‑risk uncertainty* demands it

A good heuristic:

> *Each expert should contribute a meaningfully different way of thinking, not just deeper detail along the same axis.*

---

## 1. Explicit Role‑Inference

### Description

Instruct the model to *only* identify expert roles, not solve the problem.

### When to Use

* Early analysis stages
* Expert routing in agent pipelines

### Prompt Pattern

> Analyze the input. Identify the **minimum, diverse set** of expert roles whose perspectives would materially improve evaluation. Prefer broad disciplines over narrow specializations. For each role, explain why it is distinct.

### Strengths

* High precision
* Low hallucination risk
* Encourages diversity by construction

---

## 2. Perspective Gap Analysis

### Description

Experts are inferred by first identifying what is missing, risky, or assumed.

### Prompt Pattern

> Identify assumptions, unexamined risks, and unclear claims in the input. For each, infer the *type of expert* best suited to evaluate it. Avoid naming experts that differ only by tooling or implementation.

### Strengths

* Grounded in content gaps
* Naturally limits over‑specialization

---

## 3. Discipline Decomposition (MECE)

### Description

Decompose the input across mutually exclusive dimensions, then assign **one primary expert per dimension**.

### Common Axes

* Technical feasibility
* User experience
* Data / modeling
* Operations
* Business or risk

### Prompt Pattern

> Decompose the input across key evaluation axes. For each axis, identify **one broad expert role** responsible for that perspective.

### Strengths

* Predictable structure
* Prevents expert duplication
* Strong bias toward diversity

---

## 4. Question‑Driven Expert Inference

### Description

Experts are defined by the *questions they are needed to answer*.

### Prompt Pattern

> Generate the most important unanswered questions raised by the input. Group similar questions together, then infer **one expert per group** capable of addressing them.

### Strengths

* High signal
* Prevents one‑expert‑per‑question explosion

---

## 5. Stakeholder Simulation

### Description

Infer expertise by modeling who would approve, block, or revise the proposal.

### Prompt Pattern

> Identify stakeholders who would approve, block, or request changes. Consolidate stakeholders with similar concerns into a single expert role.

### Strengths

* Surfaces conflict
* Encourages viewpoint diversity over role proliferation

---

## 6. Evidence‑Type Mapping

### Description

Map claims → required evidence → expert who evaluates that evidence.

### Prompt Pattern

> For each major claim, identify the *type of evidence* required and infer the **general class of expert** most likely to validate it.

### Strengths

* RAG‑friendly
* Anchors experts to evidence, not tools

---

## 7. Structured Output Contracts

### Description

Force deterministic and scoped expert inference via a schema.

### Example Schema

```json
{
  "experts": [
    {
      "role": "string",
      "domain": "string",
      "confidence": 0.0,
      "reason": "string",
      "questions_addressed": ["string"]
    }
  ]
}
```

### Additional Constraints (Recommended)

* Maximum experts: 3–7
* Roles must be non‑overlapping
* Roles must differ by perspective, not depth

### Strengths

* Machine‑readable
* Easy downstream routing
* Guards against hyper‑specialization

---

## 8. Two‑Pass Prompting

### Description

Separate *expert selection* from *expert analysis*.

### Pass 1

> Identify a **diverse, minimal** set of expert roles only. Do not analyze the problem.

### Pass 2

> Using the identified experts, analyze the input from each distinct perspective.

### Strengths

* Reduces cross‑contamination
* Keeps role selection clean and scoped

---

## 9. Confidence‑Weighted Experts

### Description

Assign confidence scores to inferred experts based on relevance and impact.

### Prompt Pattern

> Assign a confidence score (0–1) to each expert based on relevance and risk if omitted. Remove experts with overlapping responsibilities.

### Strengths

* Prunes low‑value roles
* Encourages consolidation

---

## 10. Disagreement‑Oriented Inference

### Description

Infer experts who would *challenge* the input rather than support it.

### Prompt Pattern

> Identify experts likely to disagree with the assumptions in this input. Prefer experts representing *different worldviews or incentives*, not narrower technical depth.

### Strengths

* Reveals hidden risks
* Improves epistemic diversity

---

## Recommended Default Pattern

For most use cases:

> Analyze the input. Identify the smallest **diverse** set of expert roles needed to fully evaluate it, based on unanswered questions, risk areas, and evidence gaps. Prefer broad disciplines. Avoid hyper‑specialized or redundant roles. Return structured output explaining why each expert matters.

This balances **precision, diversity, cost, and extensibility**.

---

## Notes for Implementation

* Prefer *few, diverse experts* with clear justification
* One expert ≠ one tool or library
* Consolidate similar concerns under a single role
* Treat deep specialization as an exception, not a default
* Keep expert inference as a reusable, standalone step

These patterns can be embedded in:

* Agent routers
* Review pipelines
* Research assistants
* Design and architecture critiques

---

**Status**: Stable pattern library
**Intended Audience**: Engineers, researchers, designers working with LLM‑driven analysis systems
