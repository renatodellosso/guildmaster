import { attack } from "../abilityTemplates";
import { DamageType, DamageTypeGroups } from "../damage";
import { EquipmentSlot } from "../equipmentSlot";
import { EquipmentDefinition } from "../item";
import { RawRegistry } from "../registry";
import { SkillId } from "../skills";

export type EquipmentId =
  | "shield_bauble"
  | "longsword"
  | "shortbow"
  | "rat_tooth_necklace"
  | "slime_cloak";

export const rawEquipments = {
  shield_bauble: {
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
  rat_tooth_necklace: {
    name: "Rat Tooth Necklace",
    description: "A necklace made from the tooth of a giant rat.",
    value: 5,
    slot: EquipmentSlot.Accessory,
    getDamageToDeal: [
      {
        type: DamageType.Piercing,
        amount: 2,
      },
    ],
  },
  slime_cloak: {
    name: "Slime Cloak",
    description: "A cloak made from slime, offering minor protection.",
    value: 20,
    slot: EquipmentSlot.Armor,
    maxHealth: 3,
    resistances: {
      [DamageTypeGroups.Elemental]: 0.15,
    },
    skills: {
      [SkillId.Magic]: 1,
    },
  },
} satisfies RawRegistry<EquipmentId, EquipmentDefinition>;
