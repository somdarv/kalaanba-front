import { describe, it, expect, beforeEach } from "vitest";

import {
  readSeedPlayer,
  resetSeedPlayer,
  writeSeedPlayer,
} from "./player-store";

const USER_ID = "01927f4a-0000-7000-8000-000000000001";

describe("seeded player store (PRODUCT.md §3.2)", () => {
  beforeEach(() => {
    resetSeedPlayer();
  });

  it("belongs to whoever is signed in", () => {
    expect(readSeedPlayer(USER_ID).user_id).toBe(USER_ID);
    expect(readSeedPlayer("someone-else").user_id).toBe("someone-else");
  });

  it("persists a write and hydrates it on the next read", () => {
    writeSeedPlayer(USER_ID, { availability_status: "weekends_only" });

    expect(readSeedPlayer(USER_ID).availability_status).toBe("weekends_only");
  });

  it("keeps earlier edits when a later write touches a different field", () => {
    writeSeedPlayer(USER_ID, { availability_status: "weekends_only" });
    writeSeedPlayer(USER_ID, { stage_name: "Shakur" });

    const player = readSeedPlayer(USER_ID);
    expect(player.availability_status).toBe("weekends_only");
    expect(player.stage_name).toBe("Shakur");
  });

  it("clears a nullable field when the patch sends null", () => {
    writeSeedPlayer(USER_ID, { preferred_number: null });

    expect(readSeedPlayer(USER_ID).preferred_number).toBeNull();
  });

  it("refuses to let the demo store edit backend-derived truth", () => {
    const before = readSeedPlayer(USER_ID);

    // Not in `UpdatePlayerInput`, so this is what a caller reaching past the
    // contract would look like. The store must drop it (Constitution Law 3):
    // teaching the surface a shape the real endpoint refuses is how a demo
    // build stops predicting the real one.
    writeSeedPlayer(USER_ID, {
      market_status: "signed",
      record: { appearances: 99 },
    } as never);

    const after = readSeedPlayer(USER_ID);
    expect(after.market_status).toBe(before.market_status);
    expect(after.record).toEqual(before.record);
  });

  it("survives a corrupt store rather than taking the surface down", () => {
    window.localStorage.setItem("kalaanba-seed-player", "{not json");

    expect(() => readSeedPlayer(USER_ID)).not.toThrow();
    expect(readSeedPlayer(USER_ID).stage_name).toBe("Baba");
  });
});
