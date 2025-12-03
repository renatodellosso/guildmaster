import { CombatSide, RetreatTriggerDefinition } from "@/lib/combat";
import {
  AdventurerInstance,
  CreatureDefinition,
  CreatureInstance,
} from "@/lib/creature";
import { DungeonDefinition } from "@/lib/dungeon";
import { GameContext } from "@/lib/gameContext";
import { RegistryContext, Registry } from "@/lib/registry";
import { Id } from "@/lib/utilTypes";

/**
 * Adds in default empty registries for any missing parts of the registry context.
 */
export function buildRegistryContext<
  TCreatureId extends Id = Id,
  TRetreatTriggerId extends Id = Id,
>(
  registry: Partial<RegistryContext<TCreatureId, TRetreatTriggerId>>
): RegistryContext<TCreatureId, TRetreatTriggerId> {
  return {
    creatures:
      registry.creatures ||
      ({} as Registry<
        TCreatureId,
        CreatureDefinition<RegistryContext<TCreatureId, TRetreatTriggerId>>
      >),
    retreatTriggers:
      registry.retreatTriggers ||
      ({} as Registry<
        TRetreatTriggerId,
        RetreatTriggerDefinition<
          RegistryContext<TCreatureId, TRetreatTriggerId>
        >
      >),
    dungeons:
      registry.dungeons ||
      ({} as Registry<
        Id,
        DungeonDefinition<RegistryContext<TCreatureId, TRetreatTriggerId>>
      >),
  };
}

export function buildCombatSide<TRegistryContext extends RegistryContext>(
  creatureInstances: (CreatureInstance<TRegistryContext> | Id)[]
): CombatSide<TRegistryContext> {
  return {
    creatures: creatureInstances,
    retreatTriggers: [],
    retreatTimer: -1,
  };
}

export function buildGameContext<TRegistryContext extends RegistryContext>(
  roster: AdventurerInstance<TRegistryContext>[] = []
): GameContext<TRegistryContext> {
  return {
    roster: roster.reduce(
      (acc, creature) => {
        acc[creature.id] = creature;
        return acc;
      },
      {} as Record<Id, AdventurerInstance<TRegistryContext>>
    ),
    expeditions: [],
    lastTick: Date.now(),
  };
}
