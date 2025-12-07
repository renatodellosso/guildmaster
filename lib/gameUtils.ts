import { buildings } from "./content/buildings";
import { AdventurerInstance, createCreatureInstance } from "./creature";
import { randomName } from "./creatureUtils";
import { GameContext, GameProvider, GameProviderSource } from "./gameContext";
import { removeFromInventory } from "./inventory";
import { ItemInstance } from "./item";
import { SkillId } from "./skills";
import { chance, chooseRandom } from "./utils";
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

export function getStartingSkillChance(gameContext: GameContext): number {
  let chance = 0.4;

  for (const building of getProviders(gameContext)) {
    const def = building.def;
    if (!def.startingSkillChance) {
      continue;
    }

    chance += getFromOptionalFunc(
      def.startingSkillChance,
      def,
      chance,
      gameContext,
      building.source
    );
  }

  return chance;
}

export function getSellValueMultiplier(gameContext: GameContext): number {
  let multiplier = 0.5;

  for (const building of getProviders(gameContext)) {
    const def = building.def;
    if (!def.sellValueMultiplier) {
      continue;
    }

    multiplier += getFromOptionalFunc(
      def.sellValueMultiplier,
      def,
      multiplier,
      gameContext,
      building.source
    );
  }

  return Math.min(Math.max(multiplier, 0), 1);
}

export function addNewAdventurer(
  gameContext: GameContext,
  skillCount: number = 0
) {
  const creature: AdventurerInstance = {
    ...createCreatureInstance("human", gameContext),
    name: randomName(),
    xp: 0,
    level: 0,
    activity: {
      definitionId: "resting",
    },
    skills: {},
  };

  const startingSkillChance = getStartingSkillChance(gameContext);

  for (let i = 0; i < skillCount; i++) {
    if (!chance(startingSkillChance)) {
      continue;
    }

    // Choose a skill to level up
    const skill = chooseRandom(Object.values(SkillId));
    creature.skills[skill] = (creature.skills[skill] || 0) + 1;
  }

  gameContext.roster[creature.id] = creature;
}

export function recruitAdventurer(gameContext: GameContext) {
  const recruitmentCost = getRecruitmentCost(gameContext);

  const maxLevel = Object.values(gameContext.roster).reduce(
    (max, creature) => Math.max(max, creature.level),
    0
  );

  removeFromInventory(gameContext.inventory, recruitmentCost);
  addNewAdventurer(gameContext, maxLevel);
}
