import { creatures } from "@/lib/content/creatures";
import { dungeons } from "@/lib/content/dungeons";
import { items } from "@/lib/content/items";
import { CreatureInstance } from "@/lib/creature";
import { titleCase } from "@/lib/format";
import {
  EquipmentDefinition,
  findCreaturesAndDungeonsThatDrop,
  isEquipment,
  ItemInstance,
} from "@/lib/item";
import { Context } from "@/lib/utilTypes";
import CreatureProviderDetails from "./CreatureProviderDetails";

export default function ItemDetails({
  itemInstance,
  creature,
  context,
}: {
  itemInstance: ItemInstance;
  creature?: CreatureInstance;
  context: Context;
}) {
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

  return (
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
          <ul>
            {[...droppedBy]
              .map(
                ({ creatureId, amount, dungeonIds }) =>
                  `${creatures[creatureId].name} (in ${[...dungeonIds]
                    .map((dungeonId) => dungeons[dungeonId].name)
                    .join(
                      ", "
                    )}) - x${Array.isArray(amount) ? amount.join("-") : amount}`
              )
              .map((text, index) => (
                <li key={index}>{text}</li>
              ))}
          </ul>
        </div>
      )}
      {equipmentDetails}
    </>
  );
}
