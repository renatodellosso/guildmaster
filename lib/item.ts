import { CreatureDefId, creatures } from "./content/creatures";
import { DungeonId } from "./content/dungeons";
import { ItemId, items } from "./content/items";
import { CreatureProvider } from "./creature";
import { findDungeonsWithCreature } from "./creatureUtils";
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

export function findCreaturesThatDrop(itemId: ItemId): Set<CreatureDefId> {
  const creaturesThatDrop = new Set<CreatureDefId>();

  for (const creature of Object.values(creatures)) {
    if (!creature.drops) {
      continue;
    }

    for (const drop of creature.drops.table.items) {
      if (drop.item.definitionId === itemId) {
        creaturesThatDrop.add(creature.id);
        break;
      }
    }
  }

  return creaturesThatDrop;
}

export function findCreaturesAndDungeonsThatDrop(itemId: ItemId): Set<{
  creatureId: CreatureDefId;
  dungeonIds: Set<DungeonId>;
}> {
  const results = new Set<{
    creatureId: CreatureDefId;
    dungeonIds: Set<DungeonId>;
  }>();

  const creatures = findCreaturesThatDrop(itemId);

  for (const creatureId of creatures) {
    const dungeons = findDungeonsWithCreature(creatureId);
    results.add({ creatureId, dungeonIds: dungeons });
  }

  return results;
}
