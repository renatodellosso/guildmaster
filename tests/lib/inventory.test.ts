import { addToInventory, Inventory, removeFromInventory } from "@/lib/inventory";
import { describe, expect, it } from "vitest";

describe(addToInventory.name, () => {
  it("merges identical items", () => {
    const inventory: Inventory = { items: [] };
    addToInventory(inventory, { definitionId: "coin", amount: 1 });
    addToInventory(inventory, { definitionId: "coin", amount: 2 });

    expect(inventory.items).toEqual([{ definitionId: "coin", amount: 3 }]);
  });
});

describe(removeFromInventory.name, () => {
  it("removes items correctly", () => {
    const inventory: Inventory = {
      items: [{ definitionId: "coin", amount: 5 }],
    };

    const result1 = removeFromInventory(inventory, {
      definitionId: "coin",
      amount: 3,
    });
    expect(result1).toBe(true);
    expect(inventory.items).toEqual([{ definitionId: "coin", amount: 2 }]);

    const result2 = removeFromInventory(inventory, {
      definitionId: "coin",
      amount: 2,
    });
    expect(result2).toBe(true);
    expect(inventory.items).toEqual([]);

    const result3 = removeFromInventory(inventory, {
      definitionId: "coin",
      amount: 1,
    });
    expect(result3).toBe(false);
  });
});
