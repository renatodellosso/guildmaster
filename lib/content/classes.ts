import { AbilityPriority } from "../abilityPriority";
import { applyStatusEffect, attack } from "../abilityTemplates";
import { ClassDefinition } from "../class";
import { getSkill } from "../creatureUtils";
import { DamageType } from "../damage";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";

export type ClassId = "thug" | "wizard" | "abjurer";

const rawClasses = {
  thug: {
    name: "Thug",
    description:
      "A brutish enforcer who uses strength and intimidation to get their way.",
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Endurance, creature, gameContext) >= 1,
    maxHealth: (_creature, _prev, _gameContext, source) =>
      25 + ((source as number) - 1) * 5,
    skills: {
      [SkillId.Melee]: (creature, _prev, _gameContext, source) =>
        (source as number) > 1
          ? getSkill(SkillId.Endurance, creature, _gameContext) / 3
          : 0,
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
    abilities: [
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
  },
  abjurer: {
    name: "Abjurer",
    description:
      "A protective spellcaster who specializes in defensive magic and wards.",
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Endurance, creature, gameContext) >= 2 &&
      creature.classes["wizard"] !== undefined &&
      creature.classes["wizard"] > 1,
    maxHealth: (creature, _prev, _gameContext, source) =>
      (source as number) * 3 +
      getSkill(SkillId.Magic, creature, _gameContext) * 5,
    abilities: (_creature, _prev, _gameContext, source) =>
      (source as number) >= 2
        ? [
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
          ]
        : [],
  },
} satisfies RawRegistry<ClassId, ClassDefinition>;

export const classes = finishRegistry<ClassId, ClassDefinition>(rawClasses);
