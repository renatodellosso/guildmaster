import { CreatureDefinition } from "../creature";
import { DropTableEntry } from "../drops";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Table } from "../table";
import { Id } from "../utilTypes";
import { DamageType, DamageTypeGroups } from "../damage";
import { attack } from "../abilityTemplates";
import { chance } from "../utils";
import { addStatusEffect, getSkill, heal } from "../creatureUtils";
import { addToExpeditionLog } from "../expedition";

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
  | "green_ooze"
  | "vampire_thrall"
  | "vampire_spawn"
  | "vampire"
  | "temple_guard"
  | "paladin"
  | "veteran_paladin"
  | "priest"
  | "familiar"
  | "apprentice_mage"
  | "archmage";

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
              addStatusEffect(target, {
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
  vampire_thrall: {
    name: "Vampire Thrall",
    maxHealth: 80,
    xpValue: 100,
    skills: {},
    resistances: {
      [DamageTypeGroups.Magical]: 0.3,
    },
    abilities: [
      attack({
        name: "Rabid Bite",
        description: "Bite an enemy.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 25,
          },
        ],
        range: 1,
      }),
    ],
    drops: {
      chance: 0.4,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "tattered_cloth", amount: [1, 2] },
        },
      ]),
    },
  },
  vampire_spawn: {
    name: "Vampire Spawn",
    maxHealth: 150,
    xpValue: 150,
    skills: {},
    resistances: {
      [DamageTypeGroups.Physical]: 0.5,
      [DamageTypeGroups.Magical]: 0.3,
    },
    abilities: [
      attack({
        name: "Vampiric Bite",
        description: "Bite an enemy and drain their life force.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 35,
          },
          {
            type: DamageType.Necrotic,
            amount: 10,
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
          item: { definitionId: "vampiric_dust", amount: 1 },
        },
      ]),
    },
  },
  vampire: {
    name: "Vampire",
    maxHealth: 250,
    xpValue: 500,
    skills: {},
    actionsPerTurn: 2,
    resistances: {
      [DamageTypeGroups.Physical]: 0.7,
      [DamageTypeGroups.Elemental]: 0.2,
      [DamageTypeGroups.Magical]: 0.4,
    },
    tick: ({ creature }, gameContext) => {
      heal(creature, 10, gameContext);
    },
    abilities: [
      attack({
        name: "Blood Drain",
        description: "Drain the life force of an enemy.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 30,
          },
          {
            type: DamageType.Necrotic,
            amount: 25,
          },
        ],
        range: 1,
        onDealDamage: (
          caster,
          _targets,
          damageDealt,
          _expedition,
          gameContext
        ) => {
          const toHeal =
            damageDealt.reduce((sum, dmg) => sum + dmg.amount, 0) * 0.5;
          heal(caster, toHeal, gameContext);
        },
      }),
      attack({
        name: "Bite",
        description: "Bite an enemy.",
        damage: [
          {
            type: DamageType.Piercing,
            amount: 30,
          },
          {
            type: DamageType.Necrotic,
            amount: 10,
          },
        ],
        range: 1,
        onDealDamage: (
          _caster,
          targets,
          _damageDealt,
          expedition,
          gameContext
        ) => {
          for (const target of targets) {
            const endurance = getSkill(SkillId.Endurance, target, gameContext);
            if (!chance(Math.max(0, 0.2 / Math.max(endurance, 1)))) {
              continue;
            }

            addStatusEffect(target, {
              definitionId: "vampirism",
              duration: "infinite",
              strength: 1,
            });

            addToExpeditionLog(
              expedition,
              `${target.name} has been afflicted with Vampirism!`
            );
          }
        },
      }),
    ],
    drops: {
      chance: 1,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "vampiric_dust", amount: [3, 7] },
        },
      ]),
    },
  },
  temple_guard: {
    name: "Temple Guard",
    maxHealth: 200,
    xpValue: 300,
    skills: {},
    resistances: {
      [DamageType.Radiant]: 0.5,
      [DamageType.Necrotic]: -0.2,
    },
    abilities: [
      attack({
        name: "Holy Strike",
        description: "Strike an enemy with a weapon imbued with holy energy.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 40,
          },
          {
            type: DamageType.Radiant,
            amount: 20,
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
          item: {
            definitionId: "coin",
            amount: [20, 50],
          },
        },
        {
          weight: 0.2,
          item: {
            definitionId: "heavy_pike",
            amount: 1,
          },
        },
        {
          weight: 1,
          item: {
            definitionId: "cloth",
            amount: [2, 5],
          },
        },
      ]),
    },
  },
  paladin: {
    name: "Paladin",
    maxHealth: 300,
    xpValue: 800,
    skills: {},
    resistances: {
      [DamageType.Radiant]: 0.7,
      [DamageType.Necrotic]: -0.3,
    },
    abilities: [
      attack({
        name: "Divine Smite",
        description: "Smite an enemy with divine energy.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 50,
          },
          {
            type: DamageType.Radiant,
            amount: 40,
          },
        ],
        range: 1,
        targets: 3,
      }),
    ],
    drops: {
      chance: 0.3,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "coin",
            amount: [20, 50],
          },
        },
        {
          weight: 0.2,
          item: {
            definitionId: "longsword",
            amount: 1,
          },
        },
        {
          weight: 1,
          item: {
            definitionId: "cloth",
            amount: [2, 5],
          },
        },
      ]),
    },
  },
  veteran_paladin: {
    name: "Veteran Paladin",
    maxHealth: 400,
    xpValue: 1200,
    skills: {},
    resistances: {
      [DamageType.Radiant]: 0.8,
      [DamageType.Necrotic]: -0.4,
    },
    abilities: [
      attack({
        name: "Holy Avalanche",
        description:
          "Unleash a powerful holy attack that damages all enemies in an area.",
        damage: [
          {
            type: DamageType.Slashing,
            amount: 60,
          },
          {
            type: DamageType.Radiant,
            amount: 50,
          },
        ],
        range: 2,
        targets: 10,
      }),
    ],
    drops: {
      chance: 0.4,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "incense",
            amount: [2, 5],
          },
        },
        {
          weight: 0.4,
          item: {
            definitionId: "chainmail_armor",
            amount: 1,
          },
        },
      ]),
    },
  },
  priest: {
    name: "Priest",
    maxHealth: 150,
    xpValue: 400,
    skills: {},
    abilities: [
      attack({
        name: "Smite Evil",
        description: "Strike an evil enemy with holy power.",
        damage: [
          {
            type: DamageType.Radiant,
            amount: 45,
          },
        ],
        range: 3,
      }),
    ],
    drops: {
      chance: 0.3,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "incense",
            amount: [3, 8],
          },
        },
        {
          weight: 0.2,
          item: {
            definitionId: "holy_sceptre",
            amount: 1,
          },
        },
      ]),
    },
  },
  familiar: {
    name: "Familiar",
    maxHealth: 30,
    xpValue: 20,
    skills: {},
    abilities: [
      attack({
        name: "Magic Missile",
        description: "Launch a magical projectile at an enemy.",
        damage: [
          {
            type: DamageType.Force,
            amount: 8,
          },
        ],
        range: 4,
        targets: 6,
      }),
    ],
    drops: {
      chance: 0.1,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "scroll",
            amount: 1,
          },
        },
        {
          weight: 0.02,
          item: {
            definitionId: "telekinetic_gloves",
            amount: 1,
          },
        },
      ]),
    },
  },
  apprentice_mage: {
    name: "Apprentice Mage",
    maxHealth: 80,
    xpValue: 500,
    skills: {},
    abilities: [
      attack({
        name: "Firebolt",
        description: "Hurl a bolt of fire at an enemy.",
        damage: [
          {
            type: DamageType.Fire,
            amount: 75,
          },
        ],
        range: 5,
      }),
    ],
    drops: {
      chance: 0.5,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "scroll",
            amount: [1, 2],
          },
        },
        {
          weight: 1,
          item: {
            definitionId: "bottle",
            amount: [1, 2],
          },
        },
        {
          weight: 0.2,
          item: {
            definitionId: "apprentice_robe",
            amount: 1,
          },
        },
      ]),
    },
  },
  archmage: {
    name: "Archmage",
    maxHealth: 200,
    xpValue: 2000,
    skills: {},
    abilities: [
      attack({
        name: "Arcane Blast",
        description: "Release a blast of arcane energy at an enemy.",
        damage: [
          {
            type: DamageType.Psychic,
            amount: 250,
          },
        ],
        range: 6,
        targets: 4,
      }),
      attack({
        name: "Chain Lightning",
        description: "Strike an enemy with lightning that jumps to others.",
        damage: [
          {
            type: DamageType.Lightning,
            amount: 150,
          },
        ],
        range: 5,
        targets: 5,
      }),
    ],
    drops: {
      chance: 1,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: {
            definitionId: "scroll",
            amount: [1, 3],
          },
        },
        {
          weight: 1,
          item: {
            definitionId: "bottle",
            amount: [1, 3],
          },
        },
        {
          weight: 0.2,
          item: {
            definitionId: "coin",
            amount: [250, 500],
          },
        },
        {
          weight: 0.1,
          item: {
            definitionId: "wizard_hat",
            amount: 1,
          },
        },
      ]),
    },
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
