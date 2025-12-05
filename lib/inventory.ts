import { ItemInstance } from "./item";

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
  item: ItemInstance
): boolean {
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
