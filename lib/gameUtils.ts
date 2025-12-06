import { buildings } from "./content/buildings";
import { GameContext } from "./gameContext";
import { getFromOptionalFunc } from "./utilTypes";

export function getMaxRosterSize(gameContext: GameContext): number {
  let maxRosterSize = 3;

  for (const building of Object.values(gameContext.buildings)) {
    const def = buildings[building.definitionId];
    if (!def.maxRosterSize) {
      continue;
    }

    maxRosterSize += getFromOptionalFunc(
      def.maxRosterSize,
      def,
      maxRosterSize,
      gameContext,
      building
    );
  }

  return maxRosterSize;
}

export function getMaxPartySize(gameContext: GameContext): number {
  let maxPartySize = 3;

  for (const building of Object.values(gameContext.buildings)) {
    const def = buildings[building.definitionId];
    if (!def.maxPartySize) {
      continue;
    }

    maxPartySize += getFromOptionalFunc(
      def.maxPartySize,
      def,
      maxPartySize,
      gameContext,
      building
    );
  }

  return maxPartySize;
}
