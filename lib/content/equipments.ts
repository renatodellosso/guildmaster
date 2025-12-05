import { DamageTypeGroups } from "../damage";
import { EquipmentDefinition, EquipmentSlot } from "../item";
import { RawRegistry } from "../registry";

export type EquipmentId = "shieldBauble";

export const rawEquipments = {
  shieldBauble: {
    name: "Shield Bauble",
    description: "A small bauble that provides minor protection.",
    value: 15,
    slot: EquipmentSlot.Accessory,
    maxHealth: 5,
    resistances: {
      [DamageTypeGroups.Physical]: 0.2,
    },
  },
} satisfies RawRegistry<EquipmentId, EquipmentDefinition>;
