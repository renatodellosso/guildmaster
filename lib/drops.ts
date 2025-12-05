import { ItemInstance } from "./item";
import { Table } from "./table";
import { randRange } from "./utils";

export type Drops = {
  chance: number;
  table: Table<DropTableEntry>;
};

export type DropTableEntry =
  | (Omit<ItemInstance, "amount"> & { amount: number | [number, number] })
  | Table<DropTableEntry>;

export function rollDrops(drops: Drops): ItemInstance[] {
  const results: ItemInstance[] = [];
  if (Math.random() > drops.chance) {
    return [];
  }

  const entry = drops.table.roll();

  if (entry instanceof Table) {
    const nestedResults = rollDrops({ chance: 1, table: entry });
    results.push(...nestedResults);
  } else {
    let amount: number;
    if (Array.isArray(entry.amount)) {
      amount = randRange(entry.amount);
    } else {
      amount = entry.amount;
    }
    results.push({ definitionId: entry.definitionId, amount });
  }

  return results;
}
