# Inferring Relevant Experts from Input

**Purpose**: This article documents a set of prompt‑engineering techniques for directing a language model to *evaluate an input and infer which kinds of experts would provide useful context*. These patterns are intended for use in analysis pipelines, agent systems, design reviews, and research workflows.

The goal is **not** roleplay for its own sake, but *selective expertise*: identifying which perspectives materially reduce uncertainty, risk, or blind spots.

---

## Why This Matters

Language models are generalists. They benefit most when we:

* Explicitly surface **knowledge gaps**
* Identify **risk‑bearing assumptions**
* Route analysis to the *right kinds of expertise*

Treating expert inference as a first‑class step improves:

* Output quality
* Cost control (fewer unnecessary perspectives)
* Determinism in multi‑agent systems

---

## 1. Explicit Role‑Inference

### Description

Instruct the model to *only* identify expert roles, not solve the problem.

### When to Use

* Early analysis stages
* Expert routing in agent pipelines

### Prompt Pattern

> Analyze the input. Identify the minimum set of expert roles whose perspectives would materially improve evaluation. For each role, explain why.

### Strengths

* High precision
* Low hallucination risk

---

## 2. Perspective Gap Analysis

### Description

Experts are inferred by first identifying what is missing, risky, or assumed.

### Prompt Pattern

> Identify assumptions, unexamined risks, and unclear claims in the input. For each, infer the expert best suited to evaluate it.

### Strengths

* Grounded in content gaps
* Avoids generic expert lists

---

## 3. Discipline Decomposition (MECE)

### Description

Decompose the input across mutually exclusive dimensions, then assign expertise per dimension.

### Common Axes

* Technical feasibility
* User experience
* Data / modeling
* Operations
* Business or risk

### Prompt Pattern

> Decompose the input across key evaluation axes. For each axis, identify the most relevant expert.

### Strengths

* Predictable structure
* Easy to standardize

---

## 4. Question‑Driven Expert Inference

### Description

Experts are defined by the *questions they are needed to answer*.

### Prompt Pattern

> Generate the most important unanswered questions raised by the input. For each question, infer the expert best qualified to answer it.

### Strengths

* High signal
* Naturally scoped

---

## 5. Stakeholder Simulation

### Description

Infer expertise by modeling who would approve, block, or revise the proposal.

### Prompt Pattern

> Identify stakeholders who would approve, block, or request changes. Infer the expertise behind each stance.

### Strengths

* Surfaces conflict
* Useful for design and architecture reviews

---

## 6. Evidence‑Type Mapping

### Description

Map claims → required evidence → expert who evaluates that evidence.

### Prompt Pattern

> For each major claim, identify required evidence and the expert most likely to validate it.

### Strengths

* RAG‑friendly
* Ties experts to concrete artifacts

---

## 7. Structured Output Contracts

### Description

Force deterministic expert inference via a schema.

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

### Strengths

* Machine‑readable
* Easy downstream routing

---

## 8. Two‑Pass Prompting

### Description

Separate *expert selection* from *expert analysis*.

### Pass 1

> Identify relevant expert roles only. Do not analyze the problem.

### Pass 2

> Using the identified experts, analyze the input from each perspective.

### Strengths

* Reduces cross‑contamination
* Works well with small models

---

## 9. Confidence‑Weighted Experts

### Description

Assign confidence scores to inferred experts based on relevance and impact.

### Prompt Pattern

> Assign a confidence score (0–1) to each expert based on relevance and risk if omitted.

### Strengths

* Prunes low‑value roles
* Controls token usage

---

## 10. Disagreement‑Oriented Inference

### Description

Infer experts who would *challenge* the input rather than support it.

### Prompt Pattern

> Identify experts likely to disagree with the assumptions in this input and explain why.

### Strengths

* Reveals hidden risks
* Surfaces alternative paradigms

---

## Recommended Default Pattern

For most use cases:

> Analyze the input. Identify the smallest set of expert roles needed to fully evaluate it, based on unanswered questions, risk areas, and evidence gaps. Return structured output explaining why each expert matters.

This balances **precision, cost, and extensibility**.

---

## Notes for Implementation

* Prefer *few experts with justification* over exhaustive lists
* Tie experts to questions or evidence whenever possible
* Keep expert inference as a reusable, standalone step

These patterns can be embedded in:

* Agent routers
* Review pipelines
* Research assistants
* Design and architecture critiques

---

**Status**: Stable pattern library
**Intended Audience**: Engineers, researchers, designers working with LLM‑driven analysis systems
