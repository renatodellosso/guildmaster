import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";

export function getMaxPartySize<TRegistryContext extends RegistryContext>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _gameContext: GameContext<TRegistryContext>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _registry: TRegistryContext,
): number {
  return 3;
}
