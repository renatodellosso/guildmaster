import { Combat } from "./combat";
import { createCreatureInstance, CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import {
  RegistryContext,
  RegistryToCreatureId,
  RegistryToDungeonId,
} from "./registry";
import { Id } from "./utilTypes";

export type Expedition<TRegistryContext extends RegistryContext> = {
  combat: Combat<TRegistryContext>;
  dungeonId: RegistryToDungeonId<TRegistryContext>;
  party: Id[];
};

export function startCombat<TRegistryContext extends RegistryContext>(
  expedition: Expedition<TRegistryContext>,
  registryContext: TRegistryContext
): Combat<TRegistryContext> {
  const dungeon = registryContext.dungeons[expedition.dungeonId];

  const encounter = dungeon.encounters.roll();

  const enemies = encounter.reduce((arr, e) => {
    for (let i = 0; i < e.count; i++) {
      arr.push(
        createCreatureInstance(
          e.id as RegistryToCreatureId<TRegistryContext>,
          registryContext
        )
      );
    }
    return arr;
  }, [] as CreatureInstance<TRegistryContext>[]);

  return {
    allies: {
      creatures: expedition.party,
      retreatTriggers: [],
      retreatTimer: -1,
    },
    enemies: {
      creatures: enemies,
      retreatTriggers: [],
      retreatTimer: -1,
    },
  };
}

export function createExpedition<TRegistryContext extends RegistryContext>(
  dungeonId: RegistryToDungeonId<TRegistryContext>,
  party: Id[],
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
): Expedition<TRegistryContext> {
  // Update activities
  for (const creatureId of party) {
    gameContext.roster[creatureId].activity = {
      definitionId: "onExpedition",
      data: { dungeonId },
    };
  }

  return {
    dungeonId,
    party,
    combat: startCombat(
      {
        dungeonId,
        party,
        combat: {} as Combat<TRegistryContext>,
      },
      registryContext
    ),
  };
}
