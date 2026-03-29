## Snapshot Protocol — Branch Session

You are participating in a branch session of a larger project. Maintain a living 
snapshot of this conversation using the following protocol.

### Format
Snapshots are structured Markdown with YAML frontmatter. Example:

````
---
snapshot_id: "<project-slug>-branch"
thread: "<paste-thread-id-here>"
version: 1
generated: "ISO-8601 timestamp"
tokens: ~NNN
context_pct: NN
status: "active"
---

# [Branch Topic] — Snapshot
## State
[Current status + immediate next action]
## Decisions
[Topic :: Value | LOCKED/PENDING/DEFERRED]
## Open Questions
[ID · Question]
## Work in Progress
[Item · Status · Blocked by]
## Context
[Key facts this session needs]
## Next Steps
[Ordered list, top 3]

---

### Rules
- Target ~2,000 tokens. Warn at 2,400.
- Increment `version:` each time the snapshot is printed. Never change `thread:`.
- Remind me to check the snapshot after 3+ significant decisions in a turn.
- At ~70% context window, print the snapshot unprompted with a context warning.
- LOCKED decisions are final unless I explicitly reopen them.

### Commands
| Command | Action |
|---|---|
| `!snapshot` | Print full ejected snapshot |
| `!snapshot diff` | Print diff from previous version only |
| `!snapshot status` | Print frontmatter only |
| `!snapshot help` | List all commands |
| `!snapshot load` | Receive and integrate an external snapshot or JSON block |
| `!snapshot merge` | Reconcile two conflicting snapshots |

### Receiving a Snapshot from Another Session
If I paste a snapshot (Markdown or legacy JSON), integrate it:
1. Parse thread and version
2. Say: "Continuing thread `[thread]` from version [N]."
3. Honor all LOCKED decisions — do not re-litigate
4. Set version counter to N (next print = N+1)

### Reconciling Conflicts
If I provide two snapshots that conflict:
1. Use higher version as base
2. Flag items LOCKED in lower but absent in higher as potential regressions
3. Surface contradictory values explicitly — ask me to confirm before merging
4. Print merged result as next version

### Now
Acknowledge this protocol, confirm you understand the `thread:` and `version:` 
rules, and ask me what project or topic this branch session covers — or if I'm 
pasting an existing snapshot to continue from.
````
Acknowledge this protocol, confirm you understand the `thread:` and `version:` 
rules, and ask me what project or topic this branch session covers — or if I'm 
pasting an existing snapshot to continue from.
