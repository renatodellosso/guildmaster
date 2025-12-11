import { items } from "@/lib/content/items";
import {
  EquipmentDefinition,
  findCreaturesAndDungeonsThatDrop,
  isEquipment,
  ItemInstance,
} from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { titleCase } from "@/lib/format";
import { CreatureInstance } from "@/lib/creature";
import CreatureProviderDetails from "./CreatureProviderDetails";
import { creatures } from "@/lib/content/creatures";
import { dungeons } from "@/lib/content/dungeons";

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
  const droppedBy = findCreaturesAndDungeonsThatDrop(itemInstance.definitionId);

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
      {droppedBy.size > 0 && (
        <div>
          <strong>Dropped by:</strong>{" "}
          <ul className="ml-2">
            {[...droppedBy].map(
              ({ creatureId, dungeonIds }) =>
                `${creatures[creatureId].name} (in ${[...dungeonIds]
                  .map((dungeonId) => dungeons[dungeonId].name)
                  .join(", ")})`
            ).map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </div>
      )}
      {equipmentDetails}
    </>
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
