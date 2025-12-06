import { CreatureDefinition } from "../creature";
import { DropTableEntry } from "../drops";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Table } from "../table";
import { Id } from "../utilTypes";
import { DamageType } from "../damage";
import { attack } from "../abilityTemplates";
import { chance } from "../utils";

export type CreatureDefId = "human" | "goblin" | "bandit" | "bandit_archer";

const rawCreatures = {
  human: {
    name: "Human",
    maxHealth: 100,
    xpValue: 10,
    skills: {},
    abilities: [
      attack({
        name: "Punch",
        description: "Punch an enemy with a fist.",
        damage: [
          {
            type: DamageType.Bludgeoning,
            amount: 5,
          },
        ],
        range: 1,
      }),
    ],
  },
  goblin: {
    name: "Goblin",
    maxHealth: 60,
    xpValue: 50,
    skills: {
      [SkillId.Melee]: 1,
    },
    drops: {
      chance: 0.5,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "coin", amount: [1, 5] },
        },
        {
          weight: 0.1,
          item: { definitionId: "shieldBauble", amount: 1 },
        },
      ]),
    },
    abilities: [
      attack({
        name: "Slash",
        description: "Slash an enemy with a crude blade.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 8,
          },
        ],
        range: 1,
        onDealDamage: (_caster, target) => {
          if (chance(0.3)) {
            target.statusEffects.push({
              definitionId: "poisoned",
              duration: 3,
              strength: 1,
            });
          }
        },
      }),
    ],
  },
  bandit: {
    name: "Bandit",
    maxHealth: 60,
    xpValue: 75,
    skills: {
      [SkillId.Melee]: 2,
    },
    abilities: [
      attack({
        name: "Slash",
        description: "Slash an enemy with a crude blade.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 10,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 0.2,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "longsword", amount: 1 },
        },
        {
          weight: 4,
          item: { definitionId: "coin", amount: [5, 15] },
        },
      ]),
    },
  },
  bandit_archer: {
    name: "Bandit Archer",
    maxHealth: 50,
    xpValue: 90,
    skills: {
      [SkillId.Ranged]: 3,
    },
    abilities: [
      attack({
        name: "Arrow Shot",
        description: "Shoot an arrow at an enemy.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 11,
          },
        ],
        range: 3,
      }),
    ],
    drops: {
      chance: 0.25,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "shortbow", amount: 1 },
        },
        {
          weight: 3,
          item: { definitionId: "coin", amount: [10, 20] },
        },
      ]),
    },
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
