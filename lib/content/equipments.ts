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
  | "slime_cloak"
  | "holy_sceptre"
  | "chainmail_armor"
  | "heavy_pike";

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
    value: 50,
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
    value: 65,
    slot: EquipmentSlot.Armor,
    maxHealth: 3,
    resistances: {
      [DamageTypeGroups.Elemental]: 0.15,
    },
    skills: {
      [SkillId.Magic]: 1,
    },
  },
  holy_sceptre: {
    name: "Holy Sceptre",
    description: "A sceptre imbued with holy power.",
    value: 100,
    slot: EquipmentSlot.Weapon,
    abilities: [
      attack({
        name: "Smite",
        description: "Smite an enemy with holy energy.",
        damage: [
          {
            type: DamageType.Radiant,
            amount: 45,
          },
        ],
        range: 2,
      }),
    ],
  },
  chainmail_armor: {
    name: "Chainmail Armor",
    description: "Armor made of interlinked metal rings, providing solid protection.",
    value: 120,
    slot: EquipmentSlot.Armor,
    maxHealth: 10,
    resistances: {
      [DamageTypeGroups.Physical]: 0.25,
    },
  },
  heavy_pike: {
    name: "Heavy Pike",
    description: "A long pole weapon designed for thrusting attacks.",
    value: 80,
    slot: EquipmentSlot.Weapon,
    abilities: [
      attack({
        name: "Thrust",
        description: "Thrust the pike at your target.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 30,
          },
        ],
        range: 3,
      }),
    ],
  },
} satisfies RawRegistry<EquipmentId, EquipmentDefinition>;
