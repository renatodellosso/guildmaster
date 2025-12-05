import { Combat } from "./combat";
import { DungeonId, dungeons } from "./content/dungeons";
import { createCreatureInstance, CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { Inventory } from "./inventory";
import { Id } from "./utilTypes";

const MAX_LOG_ENTRIES = 10;

export type Expedition = {
  combat: Combat;
  dungeonId: DungeonId;
  party: Id[];
  inventory: Inventory;
  turnNumber: number;
  log: string[];
};

/**
 * @returns the new combat
 */
export function startCombat(
  expedition: Expedition,
  gameContext: GameContext
): Combat {
  const dungeon = dungeons[expedition.dungeonId];

  const encounter = dungeon.encounters.roll();

  const enemies = encounter.reduce((arr, e) => {
    for (let i = 0; i < e.count; i++) {
      arr.push(createCreatureInstance(e.id, gameContext));
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

  const expedition: Expedition = {
    dungeonId,
    party,
    inventory: [],
    combat: undefined as unknown as Combat,
    log: [],
    turnNumber: 0,
  };

  expedition.combat = startCombat(expedition, gameContext);

  return expedition;
}

export function addToExpeditionLog(
  expedition: Expedition,
  entry: string
): void {
  expedition.log.push(`[Turn ${expedition.turnNumber}]: ${entry}`);
  if (expedition.log.length > MAX_LOG_ENTRIES) {
    expedition.log = expedition.log.slice(-MAX_LOG_ENTRIES);
  }
}
