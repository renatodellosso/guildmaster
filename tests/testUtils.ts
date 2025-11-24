import { RetreatTriggerDefinition } from "@/lib/combat";
import { CreatureDefinition } from "@/lib/creature";
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
  };
}
