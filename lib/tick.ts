import { handleCombatTick } from "./combat";
import { GameContext } from "./gameContext";

export function tick(gameContext: GameContext) {
  for (const expedition of gameContext.expeditions) {
    handleCombatTick(expedition.combat, gameContext);
  }
}
