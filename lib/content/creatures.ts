import { chooseRandomLivingTarget } from "../combat";
import { CreatureDefinition } from "../creature";
import { getSkill, takeDamage } from "../creatureUtils";
import { DropTableEntry } from "../drops";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Table } from "../table";
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
        activate: (caster, targets, expedition, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(
            targets[0],
            5 + getSkill(SkillId.Melee, caster),
            gameContext,
            expedition
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, expedition, gameContext) =>
          chooseRandomLivingTarget(expedition.combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
  goblin: {
    name: "Goblin",
    maxHealth: 80,
    xpValue: 50,
    skills: {
      [SkillId.Magic]: 1,
    },
    drops: {
      chance: 0.5,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "coin", amount: [1, 5] },
        },
        {
          weight: 9.1,
          item: { definitionId: "shieldBauble", amount: 1 },
        },
      ]),
    },
    abilities: [
      {
        name: "Slash",
        description: "Slash an enemy",
        activate: (caster, targets, expedition, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(
            targets[0],
            caster.hp / 20 + getSkill(SkillId.Magic, caster),
            gameContext,
            expedition
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, expedition, gameContext) =>
          chooseRandomLivingTarget(expedition.combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
