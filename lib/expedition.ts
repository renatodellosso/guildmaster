import { Combat } from "./combat";
import { CreatureDefId } from "./content/creatures";
import { DungeonId, dungeons } from "./content/dungeons";
import { createCreatureInstance, CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { Id } from "./utilTypes";

export type Expedition = {
  combat: Combat;
  dungeonId: DungeonId;
  party: Id[];
};

export function startCombat(expedition: Expedition): Combat {
  const dungeon = dungeons[expedition.dungeonId];

  const encounter = dungeon.encounters.roll();

  const enemies = encounter.reduce((arr, e) => {
    for (let i = 0; i < e.count; i++) {
      arr.push(createCreatureInstance(e.id as CreatureDefId));
    }
    return arr;
  }, [] as CreatureInstance[]);

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

export function createExpedition(
  dungeonId: DungeonId,
  party: Id[],
  gameContext: GameContext
): Expedition {
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
    combat: startCombat({
      dungeonId,
      party,
      combat: {} as Combat,
    }),
  };
}
