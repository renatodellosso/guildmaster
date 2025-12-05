import { items } from "@/lib/content/items";
import { EquipmentDefinition, isEquipment, ItemInstance } from "@/lib/item";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { formatBonus, titleCase } from "@/lib/format";
import { CreatureInstance } from "@/lib/creature";

export function ItemTooltip({
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
    <EquipmentDetails
      equipmentDef={equipmentDef!}
      itemInstance={itemInstance}
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

function EquipmentDetails({
  equipmentDef,
  itemInstance,
  creature,
  context,
}: {
  equipmentDef: EquipmentDefinition;
  itemInstance: ItemInstance;
  creature?: CreatureInstance;
  context: Context;
}) {
  const maxHealth =
    equipmentDef.maxHealth &&
    getFromOptionalFunc(
      equipmentDef.maxHealth,
      creature!,
      0,
      context.game,
      itemInstance
    );
  const healthRegen =
    equipmentDef.healthRegen &&
    getFromOptionalFunc(
      equipmentDef.healthRegen,
      creature!,
      0,
      context.game,
      itemInstance
    );

  const skills = Object.entries(equipmentDef.skills || {}).reduce(
    (acc, [skillId, func]) => {
      const bonus = getFromOptionalFunc(
        func,
        creature!,
        0,
        context.game,
        itemInstance
      );
      if (bonus !== 0) {
        acc[skillId] = bonus;
      }
      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

  const stats = {
    "Max Health": maxHealth,
    "Health Regen": healthRegen,
    ...skills,
  };

  return (
    <>
      {Object.entries(stats).map(([statName, stat]) => {
        if (stat === undefined) return null;
        return (
          <div key={statName}>
            {statName}: {formatBonus(stat)}
          </div>
        );
      })}
    </>
  );
}
