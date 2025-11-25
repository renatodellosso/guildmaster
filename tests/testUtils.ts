import { CombatSide, RetreatTriggerDefinition } from "@/lib/combat";
import { CreatureDefinition, CreatureInstance } from "@/lib/creature";
import { GameContext } from "@/lib/gameContext";
import {
  RegistryContext,
  Registry,
  RegistryToCreatureDefId,
} from "@/lib/registry";
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
  };
}

export function buildCombatSide<TRegistryContext extends RegistryContext>(
  creatureInstances: (
    | CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>
    | Id
  )[]
): CombatSide<TRegistryContext> {
  return {
    creatures: creatureInstances,
    retreatTriggers: [],
    retreatTimer: -1,
  };
}

export function buildGameContext<TRegistryContext extends RegistryContext>(
  roster: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[] = []
): GameContext<TRegistryContext> {
  return {
    roster: roster.reduce(
      (acc, creature) => {
        acc[creature.id] = creature;
        return acc;
      },
      {} as Record<
        Id,
        CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>
      >
    ),
    expeditions: [],
    lastTick: Date.now(),
  };
}
