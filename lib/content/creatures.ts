import { chooseRandomLivingTarget } from "../combat";
import { CreatureDefinition } from "../creature";
import { getSkill, takeDamage } from "../creatureUtils";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Id } from "../utilTypes";

export type CreatureDefId = "human" | "goblin";

const rawCreatures = {
  human: {
    name: "Human",
    maxHealth: 100,
    xpValue: 10,
    skills: {},
    abilities: [
      {
        name: "Punch",
        description: "Punch an enemy",
        activate: (caster, targets, combat, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(
            targets[0],
            5 + getSkill(SkillId.Melee, caster),
            gameContext,
            combat
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, combat, gameContext) =>
          chooseRandomLivingTarget(combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
  goblin: {
    name: "Goblin",
    maxHealth: 80,
    xpValue: 20,
    skills: {},
    abilities: [
      {
        name: "Slash",
        description: "Slash an enemy",
        activate: (caster, targets, combat, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(
            targets[0],
            caster.hp / 5 + getSkill(SkillId.Magic, caster),
            gameContext,
            combat
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, combat, gameContext) =>
          chooseRandomLivingTarget(combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
