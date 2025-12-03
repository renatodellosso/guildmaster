import { CombatSide } from "@/lib/combat";
import { AdventurerInstance, CreatureInstance } from "@/lib/creature";
import { GameContext } from "@/lib/gameContext";
import { Id } from "@/lib/utilTypes";

export function buildCombatSide(
  creatureInstances: (CreatureInstance | Id)[]
): CombatSide {
  return {
    creatures: creatureInstances,
    retreatTriggers: [],
    retreatTimer: -1,
  };
}

export function buildGameContext(
  roster: AdventurerInstance[] = []
): GameContext {
  return {
    roster: roster.reduce(
      (acc, creature) => {
        acc[creature.id] = creature;
        return acc;
      },
      {} as Record<Id, AdventurerInstance>
    ),
    expeditions: [],
    lastTick: Date.now(),
  };
}
