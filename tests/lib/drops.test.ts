import { DropTableEntry, rollDrops } from "@/lib/drops";
import { ItemInstance } from "@/lib/item";
import { Table } from "@/lib/table";
import { describe, it, expect } from "vitest";

describe(rollDrops.name, () => {
  it("returns no items when chance check fails", () => {
    // Mock Math.random to always return 0.9
    const originalRandom = Math.random;
    Math.random = () => 0.9;

    const drops = {
      chance: 0.5,
      table: {
        roll: () => ({ definitionId: "coin", amount: 1 }),
      } as Table<DropTableEntry>,
    };

    const result = rollDrops(drops);
    expect(result).toEqual([]);

    // Restore Math.random
    Math.random = originalRandom;
  });

  it("returns items when chance check passes", () => {
    // Mock Math.random to always return 0.1
    const originalRandom = Math.random;
    Math.random = () => 0.1;

    const drops = {
      chance: 0.5,
      table: {
        roll: () => ({ definitionId: "coin", amount: 2 }),
      } as Table<DropTableEntry>,
    };

    const result = rollDrops(drops);
    expect(result).toEqual([{ definitionId: "coin", amount: 2 }]);

    // Restore Math.random
    Math.random = originalRandom;
  });

  it("handles nested drop tables", () => {
    // Mock Math.random to always return 0.1
    const originalRandom = Math.random;
    Math.random = () => 0.1;

    const nestedTable = new Table<ItemInstance>([
      { weight: 1, item: { definitionId: "coin", amount: 3 } },
    ]);

    const drops = {
      chance: 1,
      table: new Table<DropTableEntry>([{ weight: 1, item: nestedTable }]),
    };

    const result = rollDrops(drops);
    expect(result).toEqual([{ definitionId: "coin", amount: 3 }]);

    // Restore Math.random
    Math.random = originalRandom;
  });
});
