import { AbilityPriority } from "../abilityPriority";
import { applyStatusEffect, attack, healAbility } from "../abilityTemplates";
import { hasBuildingTag } from "../building";
import { buildClassDescription, ClassDefinition, requireLevel } from "../class";
import { getMaxHealth, getMaxMana, getSkill, heal } from "../creatureUtils";
import { DamageType, DamageTypeGroups } from "../damage";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { chance, round } from "../utils";
import { getFromOptionalFunc } from "../utilTypes";

export type ClassId =
  | "thug"
  | "wizard"
  | "abjurer"
  | "cleric"
  | "archer"
  | "vampire"
  | "barbarian"
  | "atavist"
  | "knight"
  | "paladin";

const rawClasses = {
  thug: {
    name: "Thug",
    description: buildClassDescription(
      "A brutish enforcer who uses strength and intimidation to get their way.",
      {
        2: "+1 Melee per 3 Endurance.",
        7: "Regenerates health each tick based on Endurance.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Endurance, creature, gameContext) >= 1,
    canSelectText: "Requires at least 1 point in Endurance skill.",
    maxHealth: ({ source }) => 25 + ((source as number) - 1) * 5,
    actionsPerTurn: ({ source }) => ((source as number) >= 15 ? 1 : 0),
    skills: {
      [SkillId.Melee]: ({ creature, gameContext, source }) =>
        (source as number) >= 2
          ? getSkill(SkillId.Endurance, creature, gameContext) / 3
          : 0,
    },
    abilities: (_creature, _prev, _gameContext, source) =>
      requireLevel(
        {
          3: [
            attack({
              name: "Power Strike",
              description: "A powerful melee attack that deals extra damage.",
              damage: [
                {
                  type: DamageType.Bludgeoning,
                  amount: 15,
                },
              ],
              range: 1,
              priority: AbilityPriority.Medium,
              skill: SkillId.Melee,
            }),
          ],
        },
        _creature,
        _gameContext,
        source
      ),
    tick: ({ creature, source }, gameContext) => {
      if ((source as number) >= 7 && creature.hp > 0) {
        heal(
          creature,
          1 + getSkill(SkillId.Endurance, creature, gameContext) / 10,
          gameContext
        );
      }
    },
  },
  wizard: {
    name: "Wizard",
    description:
      "A master of arcane arts who wields powerful spells to overcome their foes.",
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Magic, creature, gameContext) >= 1,
    canSelectText: "Requires at least 1 point in Magic skill.",
    maxMana: ({ source }) => 30 + ((source as number) - 1) * 5,
    abilities: (_creature, _prev, _gameContext, source) =>
      requireLevel(
        {
          0: [
            attack({
              name: "Mana Bolt",
              description: "Hurl a bolt of magical energy at your target.",
              damage: [
                {
                  type: DamageType.Force,
                  amount: 10,
                },
              ],
              range: 3,
              manaCost: 5,
              priority: AbilityPriority.Medium,
              skill: SkillId.Magic,
            }),
          ],
          3: [
            attack({
              name: "Fireball",
              description:
                "Launch a fiery explosion that damages all enemies in an area.",
              damage: [
                {
                  type: DamageType.Fire,
                  amount: 30,
                },
              ],
              range: 3,
              targets: 3,
              manaCost: 30,
              priority: AbilityPriority.High,
              skill: SkillId.Magic,
            }),
          ],
        },
        _creature,
        _gameContext,
        source
      ),
  },
  abjurer: {
    name: "Abjurer",
    description: buildClassDescription(
      "A protective spellcaster who specializes in defensive magic and wards.",
      {
        0: "Grants a bonus to max health based on level and Magic skill.",
        5: "Provides resistance to all damage types based on mana.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Endurance, creature, gameContext) >= 2 &&
      creature.classes["wizard"] !== undefined &&
      creature.classes["wizard"] >= 2,
    canSelectText:
      "Requires at least 2 points in Endurance skill and Wizard class level 2+.",
    maxHealth: ({ creature, source, gameContext }) =>
      (source as number) * 3 +
      getSkill(SkillId.Magic, creature, gameContext) * 5,
    abilities: (_creature, _prev, _gameContext, source) =>
      requireLevel(
        {
          2: [
            applyStatusEffect({
              name: "Ward",
              description:
                "Create a magical ward that reduces incoming magic damage.",
              statusEffectId: "ward",
              duration: 2 + Math.floor((source as number) / 2),
              manaCost: 8,
              side: "ally",
              priority: AbilityPriority.Medium,
            }),
          ],
        },
        _creature,
        _gameContext,
        source
      ),
    resistances: ({ creature, gameContext, source }) =>
      (source as number) >= 5
        ? {
            [DamageTypeGroups.All]:
              creature.mana /
              Math.max(getMaxMana(creature, gameContext), 1) /
              4,
          }
        : {},
  },
  cleric: {
    name: "Cleric",
    description:
      "A holy acolyte who channels divine power to heal allies and smite foes.",
    canSelect: (creature, gameContext) =>
      getFromOptionalFunc(hasBuildingTag("temple"), gameContext) &&
      getSkill(SkillId.Magic, creature, gameContext) >= 1,
    canSelectText:
      "Requires a Temple building and at least 1 point in Magic skill.",
    maxMana: ({ source }) => 25 + ((source as number) - 1) * 5,
    abilities: (creature, _prev, gameContext, source) =>
      requireLevel(
        {
          0: [
            healAbility({
              name: "Healing Touch",
              description:
                "Heal an ally with a touch imbued with divine energy.",
              amount: 15,
              range: 1,
              manaCost: 8,
              priority: AbilityPriority.Medium,
              skill: SkillId.Magic,
            }),
          ],
          4: [
            applyStatusEffect({
              name: "Divine Shield",
              description:
                "Empower your weapon with holy energy to deal extra radiant damage.",
              statusEffectId: "divine_shield",
              duration: 3,
              manaCost: 12,
              strength: round(
                getSkill(SkillId.Magic, creature, gameContext) / 3
              ),
              side: "ally",
              priority: AbilityPriority.Medium,
            }),
          ],
        },
        creature,
        gameContext,
        source
      ),
  },
  archer: {
    name: "Archer",
    description: buildClassDescription(
      "A skilled marksman who excels at ranged combat and precision strikes.",
      {
        1: "+2 Piercing damage per level.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Ranged, creature, gameContext) >= 1,
    canSelectText: "Requires at least 1 point in Ranged skill.",
    getDamageToDeal: ({ prev, source }) =>
      (source as number) >= 1
        ? [
            ...prev,
            {
              type: DamageType.Piercing,
              amount: (source as number) * 2,
            },
          ]
        : prev,
    abilities: (_creature, _prev, _gameContext, source) =>
      requireLevel(
        {
          4: [
            attack({
              name: "Multi-Shot",
              description:
                "Shoot multiple arrows at once, hitting several targets.",
              damage: [
                {
                  type: DamageType.Piercing,
                  amount: 12,
                },
              ],
              range: 5,
              targets: 3,
              priority: AbilityPriority.Medium,
              skill: SkillId.Ranged,
            }),
          ],
        },
        _creature,
        _gameContext,
        source
      ),
  },
  vampire: {
    name: "Vampire",
    description: buildClassDescription(
      "A creature of the night that drains the life force of its enemies.",
      {
        1: "Heals for a portion of damage dealt, scaled by level.",
        3: "Regenerates health each tick based on level.",
      }
    ),
    canSelect: (creature) =>
      creature.statusEffects.some((se) => se.definitionId === "vampirism"),
    canSelectText: "Requires the Vampirism status effect.",
    skills: {
      [SkillId.Melee]: 5,
      [SkillId.Magic]: 5,
    },
    resistances: ({ source }) => ({
      [DamageType.Necrotic]: Math.min(0.2 + 0.05 * (source as number), 1),
      [DamageType.Radiant]: -0.1 - 0.05 * (source as number),
    }),
    onDealDamage: ({ dealer, damageDealt, gameContext, source }) => {
      const totalDamage = damageDealt.reduce((sum, dmg) => sum + dmg.amount, 0);
      const multiplier = Math.max(0.2 + (source as number) * 0.05, 1.2);

      heal(dealer, totalDamage * multiplier, gameContext);
    },
    tick: ({ creature, source }, gameContext) => {
      if ((source as number) >= 3 && creature.hp > 0) {
        heal(creature, 2 + (source as number), gameContext);
      }
    },
  },
  barbarian: {
    name: "Barbarian",
    description: buildClassDescription(
      "A fierce warrior who channels their rage into devastating attacks.",
      {
        1: "+1 Melee damage per level.",
        4: "Gains a chance to critically strike.",
        8: "Critical multiplier increases based on Melee skill.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Melee, creature, gameContext) >= 2 &&
      "thug" in creature.classes,
    canSelectText:
      "Requires at least 2 points in Melee skill and level 1+ Thug class.",
    skills: {
      [SkillId.Melee]: ({ source }) => source as number,
    },
    getDamageToDeal: ({ prev, source, dealer, gameContext }) => {
      if (chance(0.05 * (source as number))) {
        return prev.map((dmg) => ({
          type: dmg.type,
          amount:
            dmg.amount *
            (2 + (source as number) >= 8
              ? getSkill(SkillId.Melee, dealer, gameContext) / 10
              : 0),
        }));
      }
      return prev;
    },
  },
  atavist: {
    name: "Atavist",
    description: buildClassDescription(
      "A warrior who taps into their own life force to empower their attacks.",
      {
        1: "+3 Melee per level when below 50% health.",
        5: "Gain a bonus to damage based on how much health is missing.",
        8: "Every tick, convert 1 health per level to mana while above 50% health.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Melee, creature, gameContext) >= 2 &&
      getSkill(SkillId.Magic, creature, gameContext) >= 1,
    canSelectText:
      "Requires at least 2 points in Melee skill and 1 point in Magic skill.",
    skills: {
      [SkillId.Melee]: ({ creature, gameContext, source }) =>
        creature.hp <= getMaxHealth(creature, gameContext) / 2
          ? (source as number) * 3
          : 0,
    },
    getDamageToDeal: ({ prev, source, dealer, gameContext }) => {
      if ((source as number) < 5) {
        return prev;
      }

      const missingHealth = getMaxHealth(dealer, gameContext) - dealer.hp;
      const bonusDamage =
        ((source as number) * missingHealth) /
        getMaxHealth(dealer, gameContext);

      return prev.map((dmg) => ({
        type: dmg.type,
        amount: dmg.amount * (1 + bonusDamage),
      }));
    },
    tick: ({ creature, source }, gameContext) => {
      const maxHealth = getMaxHealth(creature, gameContext);
      if ((source as number) < 8 || creature.hp <= maxHealth / 2) {
        return;
      }

      const healthToConvert = 1 * (source as number);
      if (creature.hp - healthToConvert <= maxHealth / 2) {
        return;
      }

      creature.hp -= healthToConvert;
      creature.mana = Math.min(
        creature.mana + healthToConvert,
        getMaxMana(creature, gameContext)
      );
    },
  },
  knight: {
    name: "Knight",
    description: buildClassDescription(
      "A noble warrior clad in heavy armor, excelling in defense and melee combat.",
      {
        1: "+2 Melee per level.",
        3: "Increases max health based on Melee skill.",
        6: "Reduces incoming physical damage based on level.",
      }
    ),
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Melee, creature, gameContext) >= 2 &&
      getSkill(SkillId.Endurance, creature, gameContext) >= 2,
    canSelectText: "Requires at least 2 points in Melee and Endurance skills.",
    skills: {
      [SkillId.Melee]: ({ source }) => (source as number) * 2,
    },
    maxHealth: ({ creature, gameContext }) =>
      getSkill(SkillId.Melee, creature, gameContext) * 2,
    resistances: ({ source }) => ({
      [DamageTypeGroups.Physical]: Math.min(
        0.1 + 0.03 * (source as number),
        0.5
      ),
    }),
  },
  paladin: {
    name: "Paladin",
    description: buildClassDescription(
      "A holy warrior who combines martial prowess with divine magic to protect allies and vanquish evil.",
      {
        1: "Provides resistance to radiant and necrotic damage based on level.",
      }
    ),
    canSelect: (creature) =>
      "cleric" in creature.classes && "knight" in creature.classes,
    canSelectText: "Requires level 1+ Cleric and Knight classes.",
    resistances: ({ source }) => ({
      [DamageType.Radiant]: Math.min(0.1 + 0.04 * (source as number), 0.6),
      [DamageType.Necrotic]: Math.min(0.1 + 0.04 * (source as number), 0.6),
    }),
    abilities: (creature, _prev, gameContext, source) =>
      requireLevel(
        {
          2: [
            applyStatusEffect({
              name: "Holy Shield",
              description: "Create a holy shield that reduces incoming damage.",
              statusEffectId: "divine_shield",
              duration: 2 + Math.floor((source as number) / 3),
              strength: round(
                getSkill(SkillId.Magic, creature, gameContext) / 2
              ),
              manaCost: 45,
              side: "ally",
              targets: 10,
              priority: AbilityPriority.High,
            }),
          ],
        },
        creature,
        gameContext,
        source
      ),
  },
} satisfies RawRegistry<ClassId, ClassDefinition>;

export const classes = finishRegistry<ClassId, ClassDefinition>(rawClasses);
