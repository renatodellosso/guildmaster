import { CreatureDefinition } from "../creature";
import { finishRegistry, RawRegistry } from "../registry";
import { chooseRandom } from "../utils";
import { Id } from "../utilTypes";

export type CreatureDefId = "human" | "goblin";

const rawCreatures = {
  human: {
    name: "Human",
    skills: {},
    abilities: [
      {
        name: "Punch",
        description: "Punch an enemy",
        activate: (caster, targets) => {
          if (targets.length === 0 || !targets[0]) return;
          console.log("Activating Punch on", targets, "by", caster);
          targets[0].hp -= caster.hp / 4;
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
    skills: {},
    abilities: [
      {
        name: "Slash",
        description: "Slash an enemy",
        activate: (caster, targets) => {
          if (targets.length === 0 || !targets[0]) return;
          console.log("Activating Slash on", targets, "by", caster);
          targets[0].hp -= caster.hp / 3;
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
