import { items } from "@/lib/content/items";
import { EquipmentDefinition, isEquipment, ItemInstance } from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { titleCase } from "@/lib/format";
import { CreatureInstance } from "@/lib/creature";
import CreatureProviderDetails from "./CreatureProviderDetails";

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

  const itemDef = items[itemInstance.definitionId];
  const isItemEquipment = isEquipment(itemInstance);
  const equipmentDef = isItemEquipment
    ? (itemDef as EquipmentDefinition)
    : null;

  const equipmentDetails = isItemEquipment ? (
    <CreatureProviderDetails
      provider={itemDef as EquipmentDefinition}
      source={itemInstance}
      creature={creature}
      context={context}
    />
  ) : null;

  const tooltip = (
    <>
      <strong>
        {itemDef.name} x{itemInstance.amount}
      </strong>
      {isItemEquipment && <div>Slot: {titleCase(equipmentDef?.slot)}</div>}
      <div>
        Value: {itemDef.value * itemInstance.amount} ({itemDef.value} each)
      </div>
      <p>{itemDef.description}</p>
      {equipmentDetails}
    </>
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
