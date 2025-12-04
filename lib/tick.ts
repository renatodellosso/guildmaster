import { handleCombatTick } from "./combat";
import { activities } from "./content/activities";
import { GameContext } from "./gameContext";

export function tick(gameContext: GameContext) {
  for (const creature of Object.values(gameContext.roster)) {
    const activity = activities[creature.activity.definitionId];
    if (activity.tick) {
      activity.tick(creature, gameContext);
    }
  }

  for (const expedition of gameContext.expeditions) {
    handleCombatTick(expedition, gameContext);
  }
}
