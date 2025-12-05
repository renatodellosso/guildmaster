import { AbilityPriority } from "../abilityPriority";
import { attack } from "../abilityTemplates";
import { ClassDefinition } from "../class";
import { getSkill } from "../creatureUtils";
import { DamageType } from "../damage";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { AbilityId } from "./abilityId";

export type ClassId = "thug" | "wizard";

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
        id: AbilityId.ManaBolt,
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
} satisfies RawRegistry<ClassId, ClassDefinition>;

export const classes = finishRegistry<ClassId, ClassDefinition>(rawClasses);
