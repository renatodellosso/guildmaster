import { AbilityPriority } from "../abilityPriority";
import { applyStatusEffect, attack, healAbility } from "../abilityTemplates";
import { hasBuildingTag } from "../building";
import { buildClassDescription, ClassDefinition, requireLevel } from "../class";
import { getMaxMana, getSkill, heal } from "../creatureUtils";
import { DamageType, DamageTypeGroups } from "../damage";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { round } from "../utils";
import { getFromOptionalFunc } from "../utilTypes";

export type ClassId = "thug" | "wizard" | "abjurer" | "cleric";

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
    maxHealth: (_creature, _prev, _gameContext, source) =>
      25 + ((source as number) - 1) * 5,
    skills: {
      [SkillId.Melee]: (creature, _prev, _gameContext, source) =>
        (source as number) >= 2
          ? getSkill(SkillId.Endurance, creature, _gameContext) / 3
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
      if ((source as number) >= 7) {
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
    maxMana: (_creature, _prev, _gameContext, source) =>
      30 + ((source as number) - 1) * 5,
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
      creature.classes["wizard"] > 1,
    maxHealth: (creature, _prev, _gameContext, source) =>
      (source as number) * 3 +
      getSkill(SkillId.Magic, creature, _gameContext) * 5,
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
    resistances: (creature, gameContext, source) =>
      (source as number) >= 5
        ? {
            [DamageTypeGroups.All]:
              creature.mana / getMaxMana(creature, gameContext) / 4,
          }
        : {},
  },
  cleric: {
    name: "Cleric",
    description:
      "A holy acolyte who channels divine power to heal allies and smite foes.",
    canSelect: (creature, gameContext) => {
      return (
        getFromOptionalFunc(hasBuildingTag("temple"), gameContext) &&
        getSkill(SkillId.Magic, creature, gameContext) >= 1
      );
    },
    maxMana: (_creature, _prev, _gameContext, source) =>
      25 + ((source as number) - 1) * 5,
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
              name: "Divine Smite",
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
} satisfies RawRegistry<ClassId, ClassDefinition>;

export const classes = finishRegistry<ClassId, ClassDefinition>(rawClasses);
