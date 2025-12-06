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
    lastTick: Date.now(),
    roster: roster.reduce(
      (acc, creature) => {
        acc[creature.id] = creature;
        return acc;
      },
      {} as Record<Id, AdventurerInstance>
    ),
    expeditions: [],
    inventory: [],
    buildings: {},
    buildingsUnderConstruction: {},
  };
}

export function failTest() {
  throw new Error("This function should not have been called");
}

export function buildCreatureInstance(
  creature: Partial<CreatureInstance>
): CreatureInstance {
  return {
    id: "human",
    definitionId: "human",
    name: "Test Creature",
    hp: 10,
    mana: 5,
    equipment: {},
    statusEffects: [],
    classes: {},
    ...creature,
  };
}

export function buildAdventurerInstance(
  creature: Partial<AdventurerInstance>
): AdventurerInstance {
  return {
    ...buildCreatureInstance(creature),
    activity: { definitionId: "resting" },
    xp: 0,
    level: 1,
    skills: {},
    ...creature,
  };
}
