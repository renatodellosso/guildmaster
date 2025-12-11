import { ItemInstance } from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { CreatureInstance } from "@/lib/creature";
import ItemDetails from "./ItemDetails";

export default function ItemTooltip({
  children,
  itemInstance,
  creature,
  context,
}: {
  children: ReactNode;
  itemInstance: ItemInstance | undefined;
  creature?: CreatureInstance;
  context: Context;
}) {
  if (!itemInstance) {
    return children;
  }

  const tooltip = (
    <ItemDetails
      itemInstance={itemInstance}
      creature={creature}
      context={context}
    />
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
