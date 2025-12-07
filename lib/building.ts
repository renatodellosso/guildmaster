import { BuildingId, buildings, BuildingTag } from "./content/buildings";
import { AdventurerInstance } from "./creature";
import { getSkill } from "./creatureUtils";
import { GameContext, GameProvider } from "./gameContext";
import { removeFromInventory } from "./inventory";
import { ItemInstance } from "./item";
import { SkillId } from "./skills";
import { getFromOptionalFunc, OptionalFunc } from "./utilTypes";

export type BuildingDefinition = GameProvider & {
  id: BuildingId;
  name: string;
  tags: BuildingTag[];
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
  const newTimeRemaining = Math.min(
    timeRemaining - progress,
    buildings[buildingId].buildTime
  );
  if (newTimeRemaining === 0) {
    finishBuildingConstruction(buildingId, gameContext);
  } else {
    gameContext.buildingsUnderConstruction[buildingId] = newTimeRemaining;
  }

  return progress;
}

function finishBuildingConstruction(
  buildingId: BuildingId,
  gameContext: GameContext
) {
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

  // Replace building if applicable
  const buildingDef = buildings[buildingId];
  if (buildingDef.replaces) {
    delete gameContext.buildings[buildingDef.replaces];
  }
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

export function doesNotHaveBuildingTag(
  tag: BuildingTag
): BuildingDefinition["canBuild"] {
  return (gameContext) => {
    const func = hasBuildingTag(tag);
    return !getFromOptionalFunc(func, gameContext);
  };
}

export function hasBuildingTag(
  tag: BuildingTag
): BuildingDefinition["canBuild"] {
  return (gameContext) => {
    for (const buildingInstance of Object.values(gameContext.buildings)) {
      const buildingDef = buildings[buildingInstance.definitionId];
      if (buildingDef.tags.includes(tag)) {
        return true;
      }
    }
    return false;
  };
}

export function buildingFilter(params: {
  hasBuildingTags?: BuildingTag[];
  lacksBuildingTags?: BuildingTag[];
  hasBuildingIds?: BuildingId[];
}): BuildingDefinition["canBuild"] {
  return (gameContext) => {
    const tags = new Set<BuildingTag>();
    const ids = new Set<BuildingId>();

    for (const buildingInstance of Object.values(gameContext.buildings)) {
      const buildingDef = buildings[buildingInstance.definitionId];
      buildingDef.tags.forEach((tag) => tags.add(tag));
      ids.add(buildingInstance.definitionId);
    }

    return (
      (params.hasBuildingTags
        ? params.hasBuildingTags.every((tag) => tags.has(tag))
        : true) &&
      (params.lacksBuildingTags
        ? params.lacksBuildingTags.every((tag) => !tags.has(tag))
        : true) &&
      (params.hasBuildingIds
        ? params.hasBuildingIds.every((id) => ids.has(id))
        : true)
    );
  };
}
