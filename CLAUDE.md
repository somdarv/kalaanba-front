@AGENTS.md

# Operating Constitution (Kalaanba / Seeds of Play)

The engineering constitution lives in `.github/` and is shared with GitHub Copilot.
It is imported below so Claude Code follows the **exact same** rules. Edit the source
files in `.github/` — never duplicate them here — and both tools stay in sync.

@.github/copilot-instructions.md
@.github/instructions/engineering-standards.instructions.md
@.github/instructions/engine-docs-mandatory.instructions.md
@.github/instructions/design-system-mandatory.instructions.md

> The `applyTo:` frontmatter in those files is a Copilot directive and is harmless to
> Claude Code. Treat all four imports as always-on, layered on top of `AGENTS.md`.

## Work Packet pipeline

The 10-stage pipeline (constitution §2) is available here as slash commands backed by
subagent personas. No code change is "done" until it passes all ten **in order** — refuse
to skip stages. Every PR carries a Work Packet ID (`WP-YYYYMMDD-slug`) and shows all 10
boxes ticked.

| #  | Stage              | Slash command            | Subagent          |
| -- | ------------------ | ------------------------ | ----------------- |
| 1  | Intake             | `/01-intake`             | product-steward   |
| 2  | Impact Map         | `/02-impact-map`         | product-steward   |
| 3  | Rules Review       | `/03-rules-review`       | engine-owner      |
| 4  | Architecture Check | `/04-architecture-check` | architect         |
| 5  | Contract Design    | `/05-contract-design`    | contract-designer |
| 6  | Implementation     | `/06-implementation`     | implementer       |
| 7  | Security Review    | `/07-security-review`    | security-reviewer |
| 8  | QA Plan + Tests    | `/08-qa-plan`            | qa-engineer       |
| 9  | Docs Update        | `/09-docs-update`        | docs-scribe       |
| 10 | Release Packet     | `/10-release-packet`     | release-captain   |

Run a stage with its slash command, or invoke the subagent directly via the Task tool.
Persona definitions live in `.claude/agents/`.

When asked to implement, begin with the Work Packet header from constitution §5.

## Auto-journaling (Sankofa)

After completing any turn that contained real work, a decision, a reversal, a new rule,
an open question, a parked idea, a new term, or an action item, silently invoke the
**sankofa** subagent (Task tool) with a brief summary of the exchange — the user's intent
and what you decided or did. See `.github/instructions/auto-journal.instructions.md` for
the full rule and prompt template.

- Skip only for trivial acknowledgements ("done", "okay") with no decisions or changes.
- Do not ask permission. Do not surface Sankofa's output unless it reports an update;
  if it does, you may add one discreet final line: `📓 Journal updated.`
- **Never write to `docs/JOURNAL.md` yourself.** Sankofa owns that file exclusively.
