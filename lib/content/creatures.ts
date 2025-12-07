import { CreatureDefinition } from "../creature";
import { DropTableEntry } from "../drops";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Table } from "../table";
import { Id } from "../utilTypes";
import { DamageType } from "../damage";
import { attack } from "../abilityTemplates";
import { chance } from "../utils";

export type CreatureDefId =
  | "human"
  | "goblin"
  | "bandit"
  | "bandit_archer"
  | "rat"
  | "cave_crawler"
  | "rat_king"
  | "plague_rat"
  | "slime_tendril"
  | "green_ooze";

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
          item: { definitionId: "coin", amount: [1, 15] },
        },
        {
          weight: 0.1,
          item: { definitionId: "shield_bauble", amount: 1 },
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
            amount: 5,
          },
        ],
        range: 1,
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
            amount: 4,
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
            amount: 5,
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
  rat: {
    name: "Rat",
    maxHealth: 20,
    xpValue: 15,
    skills: {},
    abilities: [
      attack({
        name: "Bite",
        description: "Bite an enemy with sharp teeth.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 3,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 1,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "rat_tail", amount: [1, 2] },
        },
      ]),
    },
  },
  cave_crawler: {
    name: "Cave Crawler",
    maxHealth: 30,
    xpValue: 25,
    skills: {},
    abilities: [
      attack({
        name: "Claw Swipe",
        description: "Swipe at an enemy with sharp claws.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 4,
          },
        ],
        range: 1,
      }),
    ],
  },
  rat_king: {
    name: "Rat King",
    maxHealth: 150,
    xpValue: 200,
    skills: {
      [SkillId.Melee]: 2,
    },
    abilities: [
      attack({
        name: "Massive Bite",
        description: "Bite an enemy with a massive jaw.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 15,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 1,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "coin", amount: [50, 100] },
        },
        {
          weight: 1,
          item: { definitionId: "rat_tail", amount: [5, 10] },
        },
        {
          weight: 1,
          item: { definitionId: "rat_tooth_necklace", amount: 1 },
        },
      ]),
    },
  },
  plague_rat: {
    name: "Plague Rat",
    maxHealth: 25,
    xpValue: 30,
    skills: {},
    abilities: [
      attack({
        name: "Infectious Bite",
        description: "Bite an enemy and potentially infect them with disease.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 4,
          },
        ],
        range: 1,
        onDealDamage: (_caster, targets) => {
          if (chance(0.3)) {
            for (const target of targets) {
              target.statusEffects.push({
                definitionId: "poisoned",
                duration: 3,
                strength: 1,
              });
            }
          }
        },
      }),
    ],
    drops: {
      chance: 0.4,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "rat_tail", amount: [1, 3] },
        },
        {
          weight: 1,
          item: { definitionId: "coin", amount: [5, 15] },
        },
      ]),
    },
  },
  slime_tendril: {
    name: "Slime Tendril",
    maxHealth: 90,
    xpValue: 40,
    skills: {},
    abilities: [
      attack({
        name: "Slime Lash",
        description: "Lash an enemy with a tendril of slime.",
        damage: [
          {
            type: DamageType.Bludgeoning,
            amount: 6,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 0.3,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "slime", amount: [1, 2] },
        },
      ]),
    },
  },
  green_ooze: {
    name: "Green Ooze",
    maxHealth: 120,
    xpValue: 60,
    skills: {},
    abilities: [
      attack({
        name: "Corrosive Touch",
        description: "Touch an enemy with corrosive ooze.",
        damage: [
          {
            type: DamageType.Poison,
            amount: 8,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 0.5,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "slime", amount: [1, 3] },
        },
        {
          weight: 0.2,
          item: { definitionId: "slime_cloak", amount: 1 },
        },
      ]),
    },
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
