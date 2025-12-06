import { BuildingId, buildings } from "./content/buildings";
import { AdventurerInstance } from "./creature";
import { getSkill } from "./creatureUtils";
import { GameContext } from "./gameContext";
import { removeFromInventory } from "./inventory";
import { ItemInstance } from "./item";
import { SkillId } from "./skills";
import { getFromOptionalFunc, OptionalFunc } from "./utilTypes";

export type BuildingDefinition = {
  id: BuildingId;
  name: string;
  description: OptionalFunc<
    string,
    [BuildingInstance | undefined, GameContext]
  >;
  canBuild: OptionalFunc<boolean, [GameContext]>;
  cost: ItemInstance[];
  buildTime: number;
  /**
   * If specified, requires that the building this replaces is already built.
   */
  replaces?: BuildingId;
};

export type BuildingInstance = {
  definitionId: BuildingId;
  data: unknown;
};

/**
 * Does not factor in costs
 */
export function canBuild(
  buildingId: BuildingId,
  gameContext: GameContext
): boolean {
  if (
    gameContext.buildings[buildingId] ||
    gameContext.buildingsUnderConstruction[buildingId]
  ) {
    return false;
  }

  const buildingDef = buildings[buildingId];
  if (!buildingDef) return false;

  if (
    buildingDef.canBuild &&
    !getFromOptionalFunc(buildingDef.canBuild, gameContext)
  ) {
    return false;
  }

  if (buildingDef.replaces) {
    if (!gameContext.buildings[buildingDef.replaces]) {
      return false;
    }
  }

  return true;
}

export function startBuildingConstruction(
  buildingId: BuildingId,
  gameContext: GameContext
) {
  const buildingDef = buildings[buildingId];
  if (!buildingDef) {
    throw new Error(`Unknown building: ${buildingId}`);
  }

  removeFromInventory(gameContext.inventory, buildingDef.cost);

  gameContext.buildingsUnderConstruction[buildingId] = buildingDef.buildTime;
}

export function progressBuildingConstruction(
  buildingId: BuildingId,
  amount: number,
  gameContext: GameContext
) {
  const timeRemaining = gameContext.buildingsUnderConstruction[buildingId];
  if (timeRemaining === undefined) {
    throw new Error(
      `Building ${buildingId} is not under construction in this game context.`
    );
  }

  const progress = Math.min(amount, timeRemaining);
  const newTimeRemaining = timeRemaining - progress;
  if (newTimeRemaining === 0) {
    // Construction complete
    delete gameContext.buildingsUnderConstruction[buildingId];
    gameContext.buildings[buildingId] = {
      definitionId: buildingId,
      data: undefined,
    };

    // Reassign any workers
    Object.values(gameContext.roster).forEach((creature) => {
      if (
        creature.activity.definitionId === "building" &&
        creature.activity.data === buildingId
      ) {
        creature.activity = {
          definitionId: "resting",
        };
      }
    });
  } else {
    gameContext.buildingsUnderConstruction[buildingId] = newTimeRemaining;
  }

  return progress;
}

export function getConstructionProgressPerTickForWorker(
  adventurer: AdventurerInstance,
  gameContext: GameContext
): number {
  const constructionSkill = getSkill(
    SkillId.Construction,
    adventurer,
    gameContext
  );
  return constructionSkill + 1;
}
