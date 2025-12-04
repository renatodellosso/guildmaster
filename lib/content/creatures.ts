import { CreatureDefinition } from "../creature";
import { takeDamage } from "../creatureUtils";
import { finishRegistry, RawRegistry } from "../registry";
import { chooseRandom } from "../utils";
import { Id } from "../utilTypes";

export type CreatureDefId = "human" | "goblin";

const rawCreatures = {
  human: {
    name: "Human",
    maxHealth: 100,
    skills: {},
    abilities: [
      {
        name: "Punch",
        description: "Punch an enemy",
        activate: (caster, targets) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(targets[0], caster.hp / 4);
        },
        canActivate: () => true,
        selectTargets: (_caster, combat) => [
          chooseRandom(combat.enemies.creatures),
        ],
        priority: 0,
      },
    ],
  },
  goblin: {
    name: "Goblin",
    maxHealth: 80,
    skills: {},
    abilities: [
      {
        name: "Slash",
        description: "Slash an enemy",
        activate: (caster, targets) => {
          if (targets.length === 0 || !targets[0]) return;
          takeDamage(targets[0], caster.hp / 3);
        },
        canActivate: () => true,
        selectTargets: (_caster, combat) => [
          chooseRandom(combat.enemies.creatures),
        ],
        priority: 0,
      },
    ],
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
