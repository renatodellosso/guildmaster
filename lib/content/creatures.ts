import { CreatureDefinition } from "../creature";
import { finishRegistry, RawRegistry } from "../registry";
import { chooseRandom } from "../utils";
import { Id } from "../utilTypes";
import { MainRegistryContext } from "./mainRegistryContext";

export type CreatureDefId = "human";

const rawCreatures = {
  human: {
    name: "Human",
    skills: {},
    abilities: [
      {
        name: "Punch",
        description: "Punch an enemy",
        activate: (caster, targets) => {
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
} satisfies RawRegistry<Id, CreatureDefinition<MainRegistryContext>>;

export const creatures = finishRegistry<
  CreatureDefId,
  CreatureDefinition<MainRegistryContext>
>(rawCreatures);
