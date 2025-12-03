import { handleCombatTick } from "./combat";
import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";

export function tick<TRegistryContext extends RegistryContext>(
  gameContext: GameContext<TRegistryContext>,
  registry: TRegistryContext,
) {
  for (const expedition of gameContext.expeditions) {
    handleCombatTick(expedition.combat, gameContext, registry);
  }
}
