import { buildings } from "./content/buildings";
import { createCreatureInstance } from "./creature";
import { randomName } from "./creatureUtils";
import { GameContext, GameProvider, GameProviderSource } from "./gameContext";
import { removeFromInventory } from "./inventory";
import { ItemInstance } from "./item";
import { getFromOptionalFunc } from "./utilTypes";

type GameProviderWithSource = {
  def: GameProvider;
  source: GameProviderSource;
};

function getProviders(gameContext: GameContext): GameProviderWithSource[] {
  const providers: GameProviderWithSource[] = [];

  for (const building of Object.values(gameContext.buildings)) {
    const def = buildings[building.definitionId];
    providers.push({ def, source: building });
  }

  return providers;
}

export function getMaxRosterSize(gameContext: GameContext): number {
  let maxRosterSize = 3;

  for (const building of getProviders(gameContext)) {
    const def = building.def;
    if (!def.maxRosterSize) {
      continue;
    }

    maxRosterSize += getFromOptionalFunc(
      def.maxRosterSize,
      def,
      maxRosterSize,
      gameContext,
      building.source
    );
  }

  return maxRosterSize;
}

export function getMaxPartySize(gameContext: GameContext): number {
  let maxPartySize = 3;

  for (const building of getProviders(gameContext)) {
    const def = building.def;
    if (!def.maxPartySize) {
      continue;
    }

    maxPartySize += getFromOptionalFunc(
      def.maxPartySize,
      def,
      maxPartySize,
      gameContext,
      building.source
    );
  }

  return maxPartySize;
}

export function getRecruitmentCost(gameContext: GameContext): ItemInstance[] {
  let cost: ItemInstance[] = [{ definitionId: "coin", amount: 100 }];

  for (const building of getProviders(gameContext)) {
    const def = building.def;
    if (!def.recruitmentCost) {
      continue;
    }

    cost = getFromOptionalFunc(
      def.recruitmentCost,
      def,
      cost,
      gameContext,
      building.source
    );
  }

  return cost;
}

export function addNewAdventurer(gameContext: GameContext) {
  const creature = createCreatureInstance("human", gameContext);
  creature.name = randomName();
  gameContext.roster[creature.id] = {
    ...creature,
    xp: 0,
    level: 0,
    activity: {
      definitionId: "resting",
    },
    skills: {},
  };
}

export function recruitAdventurer(gameContext: GameContext) {
  const recruitmentCost = getRecruitmentCost(gameContext);

  removeFromInventory(gameContext.inventory, recruitmentCost);
  addNewAdventurer(gameContext);
}
