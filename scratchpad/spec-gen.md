**Searching for prompt frameworks**Looking into various prompt frameworks like CRISPE, CRAFT, SPEC, MADDR, and others, as well as guides from OpenAI, Google, and Microsoft to support creating software specs.
Absolutely, Brent — here’s a curated set of *battle‑tested* and *evidence‑based* prompt patterns you can copy‑paste to get high‑quality software specification docs out of **ChatGPT (GPT‑4o/“ChatGPT 5” family)** and **Gemini 2.5 Flash**. I’ve grouped them by doc type (PRD, SRS, Architecture spec) and model, and baked in best practices like role setting, explicit rubrics, structured output (JSON/sections), and iterative QA loops. I also cite sources after each relevant claim or template so you can trace the rationale.

---

## Why these prompts work (quick evidence)

- **Structure matters**: Clear roles, constraints, response formats, and checklists improve spec quality and consistency (Google’s Gemini prompt design guide; Microsoft/Azure prompt engineering guidance). [1](https://ai.google.dev/gemini-api/docs/prompting-strategies)[2](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering)[3](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/prompt-engineering-dotnet)  
- **Structured output reduces rework**: For ChatGPT, using **Structured Outputs / JSON Schema** guarantees schema‑adherence; ideal for downstream tooling. [4](https://platform.openai.com/docs/guides/structured-outputs/streaming)[5](https://cookbook.openai.com/examples/structured_outputs_intro)[6](https://thenewstack.io/openai-structured-outputs-how-to-guide-for-developers/)  
- **Standard templates raise quality**: Aligning to **IEEE/ISO 29148** SRS structures and well‑known PRD/Shape Up “Pitch” formats gives teams a common language and reduces ambiguity. [7](https://lec.inf.ethz.ch/se/2020/project/templates/part1/srs_template-ieee.doc)[8](https://cse.msu.edu/~cse870/IEEEXplore-SRS-template.pdf)[9](https://www.reqview.com/doc/iso-iec-ieee-29148-templates/)[10](https://basecamp.com/shapeup/1.5-chapter-06)  
- **More specific prompts → higher quality outputs** in software tasks; progressive detailing (requirements → design → tests) outperforms single‑shot asks. [11](https://link.springer.com/chapter/10.1007/978-3-031-82606-1_7)[12](https://arxiv.org/html/2406.10101v1)

---

# A) Product Requirements Document (PRD)

### A1) ChatGPT (GPT‑4o / “ChatGPT 5 family”): PRD with guaranteed sections + JSON sidecar

**When to use:** You need a narrative PRD for human readers **and** a parseable JSON for tooling/Notion fields.

> **System**
> You are a senior product manager. Produce a **clear, complete PRD** for the described product. Follow the section order exactly and keep each section concise but specific. After the human‑readable PRD, also output a **JSON sidecar** that follows the provided JSON Schema **exactly**.

> **User**
> Context:  
> - Product/feature: **[name]**  
> - Users/personas: **[personas]**  
> - Problem & JTBD: **[problem/JTBD]**  
> - Business goals/OKRs: **[goals]**  
> - Constraints (tech, legal, timeline): **[constraints]**  
> - Competitors/alternatives: **[competitors]**

> **Instructions**  
> 1) Write a PRD with these sections and headings:  
> **1. Executive Summary** (problem, solution synopsis, non‑goals)  
> **2. Success Metrics** (leading/lagging; include baseline and targets)  
> **3. Users & Use Cases** (personas, top journeys, accessibility notes)  
> **4. Scope & Requirements**  
> &nbsp;&nbsp;• *Functional (MoSCoW with acceptance criteria)*  
> &nbsp;&nbsp;• *Non‑Functional* (perf SLIs/SLOs, security, privacy, WCAG 2.1 AA)  
> **5. Dependencies & Risks** (mitigations)  
> **6. Rollout Plan** (feature flags, phases, guardrails, rollback)  
> **7. Analytics & Telemetry** (events, KPIs mapping)  
> **8. Open Questions**  
> 2) Tone: precise, unambiguous; avoid solutioning in requirements.  
> 3) Then output **JSON** that validates against this schema (return JSON only in the JSON block):  
> ```json
> {
>   "title": "PRD",
>   "type": "object",
>   "required": ["summary","metrics","personas","requirements","nonFunctional","risks","rollout","analytics","openQuestions"],
>   "properties": {
>     "summary":{"type":"string"},
>     "metrics":{"type":"array","items":{"type":"object","required":["name","type","baseline","target"],"properties":{"name":{"type":"string"},"type":{"type":"string","enum":["leading","lagging"]},"baseline":{"type":"string"},"target":{"type":"string"}}}},
>     "personas":{"type":"array","items":{"type":"string"}},
>     "requirements":{"type":"array","items":{"type":"object","required":["id","priority","statement","acceptanceCriteria"],"properties":{"id":{"type":"string"},"priority":{"type":"string","enum":["MUST","SHOULD","COULD","WONT"]},"statement":{"type":"string"},"acceptanceCriteria":{"type":"array","items":{"type":"string"}}}}},
>     "nonFunctional":{"type":"array","items":{"type":"object","required":["category","spec"],"properties":{"category":{"type":"string"},"spec":{"type":"string"}}}},
>     "risks":{"type":"array","items":{"type":"string"}},
>     "rollout":{"type":"object","required":["flags","phases","rollback"],"properties":{"flags":{"type":"string"},"phases":{"type":"array","items":{"type":"string"}},"rollback":{"type":"string"}}},
>     "analytics":{"type":"array","items":{"type":"object","required":["event","kpi"],"properties":{"event":{"type":"string"},"kpi":{"type":"string"}}}},
>     "openQuestions":{"type":"array","items":{"type":"string"}}
>   }
> }
> ```
> 4) Before finalizing, self‑check: do requirements avoid implementation details? do metrics map to goals?

**Why this works:** It blends a narrative PRD with **Structured Outputs/JSON Schema**, which OpenAI explicitly supports for schema‑adherent results—minimizing post‑processing. The MoSCoW and rollout/flags sections mirror modern PRD templates and PM best practices. [4](https://platform.openai.com/docs/guides/structured-outputs/streaming)[5](https://cookbook.openai.com/examples/structured_outputs_intro)[13](https://www.studiored.com/blog/eng/product-requirements-document-template/)[14](https://chisellabs.com/blog/product-requirement-document-prd-templates/)

---

### A2) Gemini 2.5 Flash: PRD optimized for Vertex AI features + token limits

**When to use:** You want fast, cost‑efficient PRDs and plan to ground facts or attach PDFs (e.g., research decks) in Vertex AI.

> **System Instruction**
> You are a Staff PM. Generate a **succinct, decision‑ready PRD**. Respect the **section order** I give. If my prompt includes file attachments, extract facts and cite them inline as *(Source: filename p.X)*. If information is missing, list targeted questions at the end rather than guessing.

> **User Prompt**
> Project: **[name]**  
> Audience: Eng, Design, Go‑to‑Market  
> Attachments: **[optional PDFs/notes]**  
> **Write the PRD with these sections (H2 headings):**  
> **Executive Summary** · **Goals & Success Metrics** · **User & Jobs‑to‑be‑Done** · **Scope (In/Out)** · **Functional Requirements (MoSCoW + acceptance criteria)** · **Non‑Functional (perf, security, privacy, a11y)** · **Dependencies & Risks** · **Launch Plan (flags, phased rollout, kill switch, rollback)** · **Analytics Plan (events → KPIs)** · **Validation Plan (experiments, sample sizes)** · **Open Questions**  
> **Then output a compact JSON object** with keys: `metrics, mosCow, analyticsEvents, risks, openQuestions`.

**Why this works:** Gemini 2.5 Flash supports **grounding with Google Search**, **file inputs (PDFs)** up to large limits, and **structured output/function calling**. Prompting it to cite from attachments and produce a summary JSON helps you wire into docs or trackers. Also be mindful of the model’s generous token limits and supported modalities when you paste large inputs. [15](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)

> **Reference PRD prompt examples/templates** you can borrow structure from:
> - Practical PRD prompt templates (step‑by‑step guides) and examples. [16](https://pmprompt.com/blog/how-to-write-prd-using-ai)[17](https://pmprompt.com/blog/prd-templates)
> - ClickUp and PM Toolkit PRD prompts with section outlines. [18](https://clickup.com/templates/ai-prompts/product-requirements-documents)[19](https://pmtoolkit.ai/prompts/prd-writing)

---

# B) Software Requirements Specification (SRS)

### B1) ChatGPT: IEEE/ISO‑aligned SRS (traceable, testable)

> **System**
> You are a **Requirements Engineer**. Produce an **IEEE/ISO‑aligned SRS** that separates *what* from *how*. All requirements must be **verifiable** and **numbered** (REQ‑X.Y). Include a **Traceability Matrix** (requirements → acceptance tests).

> **User**
> Product overview: **[context]**  
> Constraints: **[platforms, standards, regs]**  
> Interfaces: **[APIs, UI, data]**  
> Non‑functional targets: **[perf, reliability, security, a11y]**

> **Output format (use these exact top‑level headings):**  
> 1. **Introduction** (purpose, scope, references, glossary)  
> 2. **Overall Description** (perspective, users, environment, assumptions)  
> 3. **External Interfaces** (UI, API, data, comms)  
> 4. **System Requirements**  
> &nbsp;&nbsp;4.1 **Functional Requirements** (REQ‑1.x … each with rationale + acceptance criteria)  
> &nbsp;&nbsp;4.2 **Non‑Functional Requirements** (categorized with measurable thresholds)  
> 5. **System Scenarios** (top use cases)  
> 6. **Constraints** (standards, legal, platform)  
> 7. **Verification** (test strategy, **Traceability Matrix**)  
> **Appendix** (change history)

**Why this works:** Mirrors IEEE 830 / ISO/IEC/IEEE 29148 outlines, increasing completeness and readability for engineering stakeholders. [7](https://lec.inf.ethz.ch/se/2020/project/templates/part1/srs_template-ieee.doc)[8](https://cse.msu.edu/~cse870/IEEEXplore-SRS-template.pdf)[9](https://www.reqview.com/doc/iso-iec-ieee-29148-templates/)

*Tip:* If you also want a machine‑readable export, ask ChatGPT to **add a second output** as JSON matching your internal requirement schema using Structured Outputs. [4](https://platform.openai.com/docs/guides/structured-outputs/streaming)

---

### B2) Gemini 2.5 Flash: SRS with input document parsing

**Use this when you have raw inputs (notes, tickets, transcripts) and want an SRS draft with gaps called out.**

> **System Instruction**
> Act as a **Requirements Analyst**. From the attached sources (meeting transcripts, tickets, diagrams), extract and normalize requirements into an **SRS**. Clearly mark **assumptions** and **unknowns**; never invent specifics.

> **User Prompt**
> **Assemble an SRS** with the headings: Introduction, Overall Description, External Interfaces, Functional Requirements (REQ‑ IDs, acceptance criteria), Non‑Functional (quantified), Scenarios, Constraints, Verification & Traceability.  
> For each ambiguous requirement, add a bracketed “**TBD**: [question]”.  
> At the end, list all **TBDs** as stakeholder questions.

**Why this works:** Gemini can ingest and reason across multiple files per prompt (PDFs, images, text), making it strong for “distill from messy inputs” flows. [15](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)

---

# C) Architecture/Design Specification (with ADRs)

### C1) ChatGPT: arc42‑inspired architecture doc + ADRs

> **System**
> You are a Principal Architect. Produce an **Architecture Specification** aligned with **arc42** concepts. Include at least **3 Architecture Decision Records (ADRs)** with context, options, a Pugh matrix summary, and decision. Output **Markdown**.

> **User**
> Context: **[system context + constraints]**  
> Quality goals: **[e.g., performance p95<200ms, MTTR<30m]**  
> Risks/unknowns: **[list]**

> **Sections:**  
> 1. System Overview & Context Diagram (ASCII ok)  
> 2. Quality Goals & Scenarios (measurable)  
> 3. Building Blocks (modules, responsibilities, interfaces)  
> 4. Runtime Views (key sequences)  
> 5. Deployment View (environments, topology)  
> 6. Cross‑cutting concerns (security, logging, i18n, a11y)  
> 7. Risks & Technical Debt  
> 8. **ADRs** (at least 3)  
> 9. Glossary

**Why this works:** It mirrors established architecture documentation patterns (arc42) and pairs with ADR prompts used successfully in open‑source doc toolchains. [20](https://github.com/docToolchain/LLM-Prompts)

---

### C2) Gemini 2.5 Flash: Design spec + diagram stubs + checklist

> **System Instruction**
> You are a Solution Architect. Draft a **design spec** with: context, quality attributes, component diagram (ASCII block), sequence for the 2 most critical flows, data model (tables/fields), and a **review checklist** for security, reliability, and operability.

> **User Prompt**
> Context & constraints: **[text]**  
> Non‑functional targets: **[SLOs, budgets]**  
> External deps: **[APIs, services]**

> **Notes**  
> - Use concise Markdown.  
> - End with a **Review Checklist** (yes/no items) and **Open Risks**.

**Why this works:** You get a design doc that’s immediately reviewable and testable in design reviews; the checklist nudges teams to cover blind spots. [1](https://ai.google.dev/gemini-api/docs/prompting-strategies)

---

# D) Shape Up “Pitch” (spec‑lite for 6‑week bets)

If you’re running a Shape Up‑style cycle, this “pitch” spec is often the right fidelity:

> **System**
> You are an expert in Basecamp’s **Shape Up**. Produce a **Pitch** with **Problem, Appetite (timebox), Solution (fat‑marker sketches in prose), Rabbit Holes, No‑Gos**. Keep under 2 pages.

> **User**
> Problem & who it affects: **[story]**  
> Appetite: **[timebox]**  
> Constraints: **[notable constraints]**

**Why this works:** It follows the five canonical pitch ingredients from Basecamp’s methodology, used widely in practice. [10](https://basecamp.com/shapeup/1.5-chapter-06)[21](https://www.guidefari.com/shape-up-notes-writing-pitch/)

---

## Optional: Add an automated **self‑review rubric** (works well on both models)

Append this to any prompt to force a quality pass:

> **Quality Gate (model self‑check):** Before finalizing, evaluate your draft against this rubric (0–2 each; 2 = strong): Clarity, Completeness, Testability, Measurability (metrics/NFRs), Risk coverage, Traceability. List any weak areas and propose improvements, then present the improved final draft.

Evidence suggests requiring brief explanations or criteria improves evaluator reliability and reveals blind spots. [22](https://arize.com/blog/evidence-based-prompting-strategies-for-llm-as-a-judge-explanations-and-chain-of-thought/)

---

## Model‑specific tuning tips

- **ChatGPT / GPT‑4o family**  
  - Use **Structured Outputs/JSON Schema** for downstream reliability (schemas for requirements, metrics, events). [4](https://platform.openai.com/docs/guides/structured-outputs/streaming)[5](https://cookbook.openai.com/examples/structured_outputs_intro)  
  - Microsoft’s prompt engineering guides (Azure/.NET) reinforce role setting, examples, and explicit formats—use them to keep the model “on rails.” [2](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering)[3](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/prompt-engineering-dotnet)

- **Gemini 2.5 Flash**  
  - Leverage **large input windows and multi‑file attachments**; request citations to attached docs; consider **grounding with Google Search** if allowed in your workflow. [15](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)  
  - Follow Google’s prompt strategy guidance: clear instructions, constraints, and explicit response formats. [1](https://ai.google.dev/gemini-api/docs/prompting-strategies)

---

## Reference prompt libraries & templates (for deeper dives)

- Ready‑to‑use PRD prompts and examples (ClickUp, PM Toolkit, Hustle Badger collections). [18](https://clickup.com/templates/ai-prompts/product-requirements-documents)[19](https://pmtoolkit.ai/prompts/prd-writing)[23](https://www.hustlebadger.com/what-do-product-teams-do/prd-template-examples/)  
- PRD template roundups and how‑tos you can mirror structurally. [17](https://pmprompt.com/blog/prd-templates)[13](https://www.studiored.com/blog/eng/product-requirements-document-template/)[24](https://www.smartsheet.com/content/free-product-requirements-document-template)  
- IEEE/ISO SRS templates (DOC/Markdown) to align headings and IDs. [7](https://lec.inf.ethz.ch/se/2020/project/templates/part1/srs_template-ieee.doc)[25](https://github.com/jam01/SRS-Template)[9](https://www.reqview.com/doc/iso-iec-ieee-29148-templates/)  
- Architecture doc prompt kits (arc42/ADRs). [20](https://github.com/docToolchain/LLM-Prompts)  
- Research: prompt specificity and progressive prompting improve software output quality; “requirements → design → tests” flows are effective. [11](https://link.springer.com/chapter/10.1007/978-3-031-82606-1_7)[12](https://arxiv.org/html/2406.10101v1)

---

## Want me to tailor one?

If you share (even briefly) the **product type**, **personas**, **core constraints**, and whether you prefer **PRD vs SRS vs Shape‑Up pitch**, I can generate a *filled* example and a **JSON schema** matched to your team’s Notion/Jira fields—ready to paste into ChatGPT or Gemini.