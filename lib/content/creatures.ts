import { CreatureDefinition } from "../creature";
import { finishRegistry, RawRegistry } from "../registry";
import { Id } from "../utilTypes";
import { MainRegistryContext } from "./mainRegistryContext";

export type CreatureDefId = "test";

const rawCreatures = {
  test: {
    name: "Test Creature",
    skills: {},
    abilities: [
      {
        name: "Test Ability",
        description: "An ability for testing purposes.",
        activate: (caster) => {
          console.log("Test Ability Activated");
          caster.hp += 10;
        },
        canActivate: () => true,
        selectTargets: (caster) => [caster],
        priority: 0,
      },
    ],
  },
} satisfies RawRegistry<Id, CreatureDefinition<MainRegistryContext>>;

export const creatures = finishRegistry<
  CreatureDefId,
  CreatureDefinition<MainRegistryContext>
>(rawCreatures);
