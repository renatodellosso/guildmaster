import { ItemId, items } from "./content/items";
import { CreatureProvider } from "./creature";
import { EquipmentSlot } from "./equipmentSlot";

export type ItemDefinition = {
  id: ItemId;
  name: string;
  description: string;
  value: number;
};

export type ItemInstance = {
  definitionId: ItemId;
  amount: number;
};

export type EquipmentDefinition = ItemDefinition &
  CreatureProvider & {
    slot: EquipmentSlot;
  };

export function areItemsEqual(
  itemA: ItemInstance,
  itemB: ItemInstance
): boolean {
  const keys = new Set([...Object.keys(itemA), ...Object.keys(itemB)]);
  keys.delete("amount");

  for (const key of keys) {
    if (
      (itemA as Record<string, unknown>)[key] !==
      (itemB as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
}

/**
 * @param filter does not filter by amount
 */
export function matchesItemFilter(
  item: ItemInstance,
  filter: Partial<ItemInstance>
): boolean {
  const keys = Object.keys(filter).filter((k) => k !== "amount");

  for (const key of keys) {
    if (
      (item as Record<string, unknown>)[key] !==
      (filter as Record<string, unknown>)[key]
    ) {
      return false;
    }
  }

  return true;
}

export function isEquipment(item: ItemInstance): boolean {
  if (!(item.definitionId in items)) {
    return false;
  }
  const def = items[item.definitionId];
  return "slot" in def;
}