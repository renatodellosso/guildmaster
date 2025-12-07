import { ItemInstance } from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import ItemTooltip from "./ItemTooltip";
import { items as itemLib } from "@/lib/content/items";
import { formatInt } from "@/lib/format";
import { countInInventory } from "@/lib/inventory";

export default function ItemList({
  items,
  context,
  colorIfAvailable,
}: {
  items: ItemInstance[];
  context: Context;
  colorIfAvailable?: boolean;
}) {
  return (
    <>
      {items.map((item, index) => (
        <ItemTooltip key={index} itemInstance={item} context={context}>
          <div
            className={
              colorIfAvailable &&
              countInInventory(context.game.inventory, item) >= item.amount
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {formatInt(item.amount)}x {itemLib[item.definitionId]?.name} (
            {countInInventory(context.game.inventory, item)})
          </div>
        </ItemTooltip>
      ))}
    </>
  );
}
