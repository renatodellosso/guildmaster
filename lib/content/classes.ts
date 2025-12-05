import { ClassDefinition } from "../class";
import { getSkill } from "../creatureUtils";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";

export type ClassId = "thug";

const rawClasses = {
  thug: {
    name: "Thug",
    description:
      "A brutish enforcer who uses strength and intimidation to get their way.",
    canSelect: (creature, gameContext) =>
      getSkill(SkillId.Melee, creature, gameContext) >= 1,
    maxHealth: (_creature, _prev, _gameContext, source) =>
      25 + ((source as number) - 1) * 5,
  },
} satisfies RawRegistry<ClassId, ClassDefinition>;

export const classes = finishRegistry<ClassId, ClassDefinition>(rawClasses);
