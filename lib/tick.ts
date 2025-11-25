import { takeCombatTurn } from "./combat";
import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";

export function tick<TRegistryContext extends RegistryContext>(
  gameContext: GameContext<TRegistryContext>,
  registry: TRegistryContext
) {
  for (const combat of gameContext.combats) {
    takeCombatTurn(combat, () => {}, gameContext, registry);
  }
}
