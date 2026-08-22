import { describe, expect, it } from "vitest";

import type { VerifiedRecord } from "@/lib/api/player";

import {
  balanceStrip,
  hasAnyStat,
  leadStatsFor,
  secondaryStatsFor,
  statLabelFor,
  statPriorityFor,
  stripColumns,
} from "./player-card-stats";

const EMPTY: VerifiedRecord = {
  appearances: 0,
  goals: 0,
  assists: 0,
  minutes: 0,
  yellow_cards: 0,
  red_cards: 0,
};

const record = (over: Partial<VerifiedRecord> = {}): VerifiedRecord => ({
  ...EMPTY,
  ...over,
});

describe("statPriorityFor — which counters a position is billed on (Law 2)", () => {
  it("takes the order config gives it", () => {
    const order = statPriorityFor("goalkeeper", {
      goalkeeper: ["appearances", "clean_sheets", "minutes"],
    });
    expect(order.slice(0, 3)).toEqual([
      "appearances",
      "clean_sheets",
      "minutes",
    ]);
  });

  it("appends the counters config never named, so nothing is hidden", () => {
    // The key decides billing, never visibility. An admin who forgets `starts`
    // must not thereby delete it from every card in the country.
    const order = statPriorityFor("goalkeeper", {
      goalkeeper: ["appearances", "clean_sheets", "minutes"],
    });
    expect(order).toContain("starts");
    expect(order).toContain("goals");
    expect(order).toHaveLength(6);
  });

  it("drops keys that are not counters, and collapses repeats", () => {
    const order = statPriorityFor("striker", {
      striker: ["goals", "goals", "vibes", "assists", "appearances"],
    });
    expect(order.slice(0, 3)).toEqual(["goals", "assists", "appearances"]);
    expect(order).toHaveLength(6);
  });

  it("discards a too-short list whole rather than topping it up", () => {
    // A list edited down to two is a mistake. Completing it quietly would
    // produce an order nobody chose and hide the mistake from whoever made it.
    const order = statPriorityFor("striker", { striker: ["goals", "assists"] });
    expect(order[0]).toBe("appearances");
  });

  it("falls back for a position config says nothing about", () => {
    expect(statPriorityFor("left_winger", {})[0]).toBe("appearances");
    expect(statPriorityFor(null, undefined)[0]).toBe("appearances");
  });
});

describe("leadStatsFor — the card never leads with a zero", () => {
  const strikerOrder = statPriorityFor("striker", {
    striker: ["appearances", "goals", "assists", "minutes", "starts"],
  });

  it("bills the first three the player has something in", () => {
    expect(
      leadStatsFor(
        strikerOrder,
        record({ appearances: 9, goals: 4, assists: 2 }),
      ),
    ).toEqual(["appearances", "goals", "assists"]);
  });

  it("skips an empty counter and promotes the next one down", () => {
    // A striker with no goals yet leads with what he has. The zero is not a
    // verdict on him, and three headline figures is not where it belongs.
    const lead = leadStatsFor(
      strikerOrder,
      record({ appearances: 6, goals: 0, assists: 2, minutes: 410 }),
    );
    expect(lead).toEqual(["appearances", "assists", "minutes"]);
    expect(lead).not.toContain("goals");
  });

  it("fills the row rather than leaving a hole when little is scoring", () => {
    const lead = leadStatsFor(strikerOrder, record({ appearances: 1 }));
    expect(lead).toHaveLength(3);
    expect(lead[0]).toBe("appearances");
  });

  it("never bills a counter the API did not send", () => {
    // `starts` and `clean_sheets` are additive on the contract, so a client on
    // this build may face an API that predates them.
    const lead = leadStatsFor(
      statPriorityFor("goalkeeper", {
        goalkeeper: ["clean_sheets", "starts", "appearances", "minutes"],
      }),
      record({ appearances: 3, minutes: 270 }),
    );
    expect(lead).not.toContain("clean_sheets");
    expect(lead).not.toContain("starts");
  });
});

describe("secondaryStatsFor — everything the lead row did not take", () => {
  it("keeps the rest, in priority order, including the zeroes", () => {
    const order = statPriorityFor("striker", undefined);
    const stats = record({
      appearances: 6,
      goals: 0,
      assists: 2,
      minutes: 410,
    });
    const lead = leadStatsFor(order, stats);

    // Goals still appears. Featuring decides billing, not visibility.
    expect(secondaryStatsFor(order, lead, stats)).toContain("goals");
  });

  it("omits counters the API never sent", () => {
    const order = statPriorityFor("striker", undefined);
    const stats = record({ appearances: 6, goals: 3, assists: 2 });
    const lead = leadStatsFor(order, stats);

    expect(secondaryStatsFor(order, lead, stats)).not.toContain("starts");
  });
});

describe("the strip fills whole rows", () => {
  it("takes two columns, so a justified label and value have room", () => {
    // Never three: at a third of a 360px card the label and the value collide
    // and the alignment stops meaning anything.
    expect(stripColumns(2)).toBe(2);
    expect(stripColumns(3)).toBe(2);
    expect(stripColumns(4)).toBe(2);
  });

  it("gives a lone item the full width", () => {
    expect(stripColumns(1)).toBe(1);
  });

  it("leaves an even count alone", () => {
    expect(balanceStrip(["a", "b", "c", "d"], null)).toHaveLength(4);
    expect(balanceStrip(["a", "b", "c"], "cards")).toHaveLength(4);
  });

  it("drops a stat rather than orphaning a last row", () => {
    expect(balanceStrip(["a", "b", "c"], null)).toEqual(["a", "b"]);
  });

  it("keeps the disciplinary line and sheds a stat instead", () => {
    // A red card is the one figure on the strip a club asks about. The
    // counters that matter are already billed at display scale above.
    expect(balanceStrip(["minutes", "starts"], "cards")).toEqual([
      "minutes",
      "cards",
    ]);
  });
});

describe("hasAnyStat — a record of zeroes is not a record", () => {
  it("is false for nothing, and for all zeroes", () => {
    expect(hasAnyStat(null)).toBe(false);
    expect(hasAnyStat(EMPTY)).toBe(false);
  });

  it("is true on any counter, not just a billed one", () => {
    // A keeper whose only figure is a clean sheet has a record, and asking
    // only about the lead trio would have told him he did not.
    expect(hasAnyStat(record({ clean_sheets: 1 }))).toBe(true);
    expect(hasAnyStat(record({ player_of_the_match: 1 }))).toBe(true);
  });
});

describe("statLabelFor — two registers, config over defaults", () => {
  it("abbreviates clean sheets for the lead column and spells it out below", () => {
    expect(statLabelFor("clean_sheets", undefined)).toEqual({
      label: "Clean sheets",
      short: "CLN SHTS",
    });
  });

  it("takes config's word for it (Law 4)", () => {
    expect(
      statLabelFor("goals", { goals: { label: "Buta", short: "BTA" } }),
    ).toEqual({ label: "Buta", short: "BTA" });
  });

  it("falls back per field, so half an entry still renders a card", () => {
    expect(statLabelFor("goals", { goals: { label: "Buta" } })).toEqual({
      label: "Buta",
      short: "GOALS",
    });
  });
});
