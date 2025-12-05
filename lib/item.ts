import { ItemId } from "./content/items";
import { CreatureProvider } from "./creature";

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

export enum EquipmentSlot {
  Weapon = "weapon",
  Armor = "armor",
  Accessory = "accessory",
}

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
