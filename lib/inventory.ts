import { ItemInstance, matchesItemFilter } from "./item";

export type Inventory = ItemInstance[];

export function addToInventory(
  inventory: Inventory,
  item: ItemInstance | ItemInstance[]
) {
  if (Array.isArray(item)) {
    for (const it of item) {
      addToInventory(inventory, it);
    }
    return;
  }

  const existingItem = inventory.find(
    (i) => i.definitionId === item.definitionId
  );
  if (existingItem) {
    existingItem.amount += item.amount;
  } else {
    inventory.push({ ...item });
  }
}

export function removeFromInventory(
  inventory: Inventory,
  item: ItemInstance | ItemInstance[]
): boolean {
  if (Array.isArray(item)) {
    for (const it of item) {
      const success = removeFromInventory(inventory, it);
      if (!success) return false;
    }
    return true;
  }

  const existingItemIndex = inventory.findIndex(
    (i) => i.definitionId === item.definitionId
  );
  if (existingItemIndex === -1) {
    return false;
  }

  const existingItem = inventory[existingItemIndex];
  if (existingItem.amount < item.amount) {
    return false;
  } else if (existingItem.amount === item.amount) {
    inventory.splice(existingItemIndex, 1);
  } else {
    existingItem.amount -= item.amount;
  }

  return true;
}

export function hasInInventory(
  inventory: Inventory,
  item: ItemInstance | ItemInstance[]
): boolean {
  if (Array.isArray(item)) {
    return item.every((it) => hasInInventory(inventory, it));
  }

  const existingItem = inventory.find((i) => matchesItemFilter(i, item));

  return existingItem !== undefined && existingItem.amount >= item.amount;
}
