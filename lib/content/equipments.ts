import { attack } from "../abilityTemplates";
import { DamageType, DamageTypeGroups } from "../damage";
import { EquipmentDefinition, EquipmentSlot } from "../item";
import { RawRegistry } from "../registry";
import { AbilityId } from "./abilityId";

export type EquipmentId = "shieldBauble" | "longsword" | "shortbow";

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
  longsword: {
    name: "Longsword",
    description: "A standard longsword, effective for slashing attacks.",
    value: 50,
    slot: EquipmentSlot.Weapon,
    abilities: [
      attack({
        id: AbilityId.LongswordSlash,
        name: "Slash",
        description: "Slash an enemy with a longsword.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 15,
          },
        ],
        range: 1,
      }),
    ],
  },
  shortbow: {
    name: "Shortbow",
    description: "A simple shortbow for ranged attacks.",
    value: 40,
    slot: EquipmentSlot.Weapon,
    abilities: [
      attack({
        id: AbilityId.Arrow,
        name: "Arrow",
        description: "Shoot an arrow at your target.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 20,
          },
        ],
        range: 3,
      }),
    ],
  },
} satisfies RawRegistry<EquipmentId, EquipmentDefinition>;
