---
description: Stage 1 — convert a raw request into a Work Packet (product-steward).
argument-hint: <raw feature request>
---

Delegate to the **product-steward** subagent (Task tool). Take the following raw request and produce a Work Packet.

Raw request:
$ARGUMENTS

Output exactly this structure:

## Work Packet

- **ID:** WP-YYYYMMDD-<slug>
- **Title:**
- **Problem:**
- **User value:**
- **Primary engine:**
- **Secondary engines:**
- **Public surfaces affected:**
- **Private surfaces affected:**
- **Configurable values involved:**
- **Build Plan stage(s) advanced:**
- **Success criteria:**
- **Out of scope:**
- **Open questions:**

Then list the **next stage** and which subagent should handle it (likely engine-owner per affected engine, then architect).
