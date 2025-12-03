import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";

export function getMaxPartySize<TRegistryContext extends RegistryContext>(
  _gameContext: GameContext<TRegistryContext>,
  _registry: TRegistryContext
): number {
  return 3;
}
