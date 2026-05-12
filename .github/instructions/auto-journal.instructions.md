---
description: "Always-on rule: after every substantive response, silently delegate to the Sankofa subagent so it can update docs/JOURNAL.md if the exchange contained anything journal-worthy."
applyTo: "**"
---

# Auto-journaling (Sankofa)

After completing your response to the user, silently invoke the **Sankofa** subagent (via the runSubagent tool with `agentName: "Sankofa"`) and pass it a brief summary of the latest exchange — the user's request and what you actually did or decided.

## Rules

- **Run it after every turn that contained real work or discussion.** Skip only if your response was a single trivial acknowledgement (e.g. "done", "okay") with no decisions, no code changes, no Q&A.
- **Do not ask the user for permission.** This is automatic.
- **Do not surface Sankofa's output to the user** unless it reports an actual update. If Sankofa returns `No update.`, stay silent.
- **If Sankofa reports `Updated docs/JOURNAL.md: ...`**, you may include a single discreet line at the very end of your reply: `📓 Journal updated.` Nothing more.
- **Never journal on the user's behalf yourself.** Sankofa owns `docs/JOURNAL.md`. You must not touch that file directly.
- **Pass enough context.** Sankofa is stateless — it only sees what you give it. Include: the user's intent in this turn, any decision/reversal/rule/parked idea/open question/new term/action item that came up, and the date.

## Prompt template for the subagent call

```
Latest exchange (date: <YYYY-MM-DD>):

User asked: <one-line summary of the user's request>

I did / decided: <bullet list of concrete decisions, reversals, rules, parked ideas, open questions, new terms, or action items that surfaced — only the journal-worthy bits, not routine work>

Update docs/JOURNAL.md if anything above is worth recording. Otherwise reply "No update."
```

If nothing journal-worthy surfaced, you may skip the call entirely.
