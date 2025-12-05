import { handleCombatTick } from "./combat";
import { activities } from "./content/activities";
import { getHealthRegen, heal } from "./creatureUtils";
import { GameContext } from "./gameContext";

export function tick(gameContext: GameContext) {
  healRoster(gameContext);

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

function healRoster(gameContext: GameContext) {
  for (const creature of Object.values(gameContext.roster)) {
    const activity = activities[creature.activity.definitionId];
    const regenMultiplier = activity.healthRegenMultiplier ?? 1;

    const regen = getHealthRegen(creature, gameContext) * regenMultiplier;
    heal(creature, regen, gameContext);
  }
}
