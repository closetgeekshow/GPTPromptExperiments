# Snapshot Protocol Specification v1.0

## Purpose
The snapshot is a losslessly-compressed, human-readable record of project state 
that can reconstruct conversation context in a new session. It is the authoritative 
source of truth for long-horizon planning across sessions and model instances.

````
---

## Snapshot Format

### YAML Frontmatter (required)
\`\`\`yaml
---
snapshot_id: "<project-slug>"          # stable, never changes
thread: "<project-slug-YYYY-MM-DD>"    # set at session start, never changes
version: 1                             # increments each time snapshot is printed
generated: "ISO-8601 timestamp"
tokens: ~NNN                           # estimated token count
context_pct: NN                        # % of context window used at time of print
status: "active | paused | complete"
---
\`\`\`

### Body Sections (Markdown)
Use these standard sections. Omit empty sections. Use compact notation throughout.

\`\`\`markdown
# [Project Name] — Snapshot

## State
One-line current status + immediate next action.

## Decisions
<!-- Format: Topic :: Value | STATUS -->
<!-- STATUS = LOCKED | PENDING | DEFERRED | REVERSED -->
Pipeline order :: Strip → Join → Remark → Walk → Bag | LOCKED
TypeName casing :: Uppercase required | LOCKED

## Open Questions
<!-- Format: ID · Question · [owner if known] -->
Q1 · Registry entry shape · next discussion

## Work in Progress
<!-- Format: Item · Status · Blocked by (if any) -->
EBNF grammar · COMPLETE
AST types · COMPLETE
§1–§20 spec sections · READY TO WRITE · none
§21–§22 registry sections · BLOCKED · registry discussion

## Resolved
<!-- Compact log of closed items — omit rationale -->
R01–R11 grammar mismatches · resolved
Step 3 AST open questions · locked (separate types, always attrSource, dual index)

## Context
<!-- Anything a new session needs to not ask again -->
- Output targets: React/JSX, HTML, CSS, JS
- TypeNames are PascalCase React components by convention
- Progressive formalization is a core value — unknown TypeNames never error
- HTML intrinsics expressed as uppercase TypeNames, mapped by registry

## Next Steps
1. Registry discussion (prompt ready)
2. Write spec §1–§20 + Appendices A/B/D/E
3. After registry: write §21–§22 + Appendix C
\`\`\`

---

## Commands

| Command | Action |
|---|---|
| `!snapshot` | Print full ejected snapshot (standalone, self-contained) |
| `!snapshot diff` | Print diff from previous version only |
| `!snapshot status` | Print frontmatter only — quick version/context check |
| `!snapshot help` | List all commands |
| `!snapshot load` | Receive and integrate an external snapshot or JSON block |
| `!snapshot merge` | Reconcile two conflicting snapshots (interactive) |
| `!snapshot reset` | Start fresh (requires confirmation) |

---

## Size Budget

- **Target:** ~2,000 tokens
- **Hard warn at:** 2,400 tokens — print warning, ask what to archive
- **Cannot compress further:** State explicitly: "Snapshot exceeds limit and cannot 
  be losslessly compressed. Recommend archiving [section] to external storage."
- **Compression rules (apply in order):**
  1. Omit empty sections
  2. Abbreviate STATUS tags (L=LOCKED, P=PENDING, D=DEFERRED, R=REVERSED)
  3. Collapse Resolved items to count: "14 items resolved — see archive"
  4. Inline short Context items as comma-separated
  5. Truncate Next Steps to top 3
  6. Never compress: Decisions, Open Questions, Work in Progress

---

## Diff Format

A diff snapshot shows only what changed since the previous version.
Include full frontmatter with `diff_from: N` added.

\`\`\`markdown
---
snapshot_id: "protomodel-spec"
thread: "protomodel-2026-03-29"
version: 9
diff_from: 8
generated: "2026-03-29T18:35:00-04:00"
---

# Snapshot Diff v8 → v9

## Added
- NoteNode kind discriminator (inline | heading)
- Heading MDAST nodes always go to documentNotes[]
- Section dependency order documented

## Changed
- spec_document.status: "outline complete" → "prompt ready"
- open_questions.heading_nodes → RESOLVED

## Removed
- (none)
\`\`\`

---

## Receiving an External Snapshot

When the user pastes a snapshot (Markdown+YAML or legacy JSON):

1. Parse `thread:` and `version:` from frontmatter (or JSON meta block)
2. Announce: "Continuing thread `[thread]` from version [N]."
3. Integrate all decisions, open questions, and context into working memory
4. Do not re-litigate LOCKED decisions unless user explicitly opens them
5. Set internal version counter to N (next print = N+1)

---

## Reconciling Conflicting Snapshots

When two snapshots of the same thread have diverged:

1. Identify the higher `version:` — treat as base
2. List items in the lower version not present in the higher — flag each:
   - If LOCKED in lower but absent in higher: **flag as potential regression**
   - If PENDING in lower and LOCKED in higher: defer to higher
   - If contradictory values for same key: **surface to user explicitly**
3. Ask user to confirm each flagged item before merging
4. Print merged snapshot as next version after confirmation

---

## Version and Thread Rules

- `thread:` is set once at session start and **never changes**, even across 
  model instances or sessions. Format: `<project-slug>-YYYY-MM-DD` (date of 
  first session).
- `snapshot_id:` is the stable project identifier. Same as slug portion of thread.
- `version:` increments **only when the snapshot is printed** — not on every 
  update. Silent background updates do not increment version.
- If a new session starts without a snapshot: assign `version: 1`, generate 
  a new `thread:` from today's date.


````
