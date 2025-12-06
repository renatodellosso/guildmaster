import { ItemInstance } from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import ItemTooltip from "./ItemTooltip";
import { items as itemLib } from "@/lib/content/items";
import { formatInt } from "@/lib/format";

export default function ItemList({
  items,
  context,
}: {
  items: ItemInstance[];
  context: Context;
}) {
  return (
    <>
      {items.map((item, index) => (
        <ItemTooltip key={index} itemInstance={item} context={context}>
          <div>
            {formatInt(item.amount)}x {itemLib[item.definitionId]?.name}
          </div>
        </ItemTooltip>
      ))}
    </>
  );
}
