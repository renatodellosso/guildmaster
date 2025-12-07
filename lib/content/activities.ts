import { ActivityDefinition } from "../activity";
import {
  getConstructionProgressPerTickForWorker,
  progressBuildingConstruction,
} from "../building";
import { finishRegistry, RawRegistry } from "../registry";
import { BuildingId, buildings } from "./buildings";
import { dungeons } from "./dungeons";

export type ActivityId = "resting" | "onExpedition" | "building";

const rawActivities = {
  resting: {
    description: "Resting",
    healthRegenMultiplier: 3,
  },
  onExpedition: {
    description: (creature, gameContext) => {
      const expedition = gameContext.expeditions.find((expedition) =>
        expedition.party.includes(creature.id)
      );

      const dungeonName = expedition
        ? dungeons[expedition.dungeonId].name
        : "an unknown location";

      return `On Expedition to ${dungeonName}`;
    },
    healthRegenMultiplier: 0,
    canReassign: false,
  },
  building: {
    description: (creature) => {
      const buildingId = creature.activity.data as BuildingId;
      const def = buildings[buildingId];
      return `Constructing ${def.name}`;
    },
    healthRegenMultiplier: 1,
    canReassign: true,
    tick: (creature, gameContext) => {
      const buildingId = creature.activity.data as BuildingId;
      const progress = progressBuildingConstruction(
        buildingId,
        getConstructionProgressPerTickForWorker(creature, gameContext),
        gameContext
      );

      creature.xp += progress;
    },
  },
} satisfies RawRegistry<ActivityId, ActivityDefinition>;

export const activities = finishRegistry<ActivityId, ActivityDefinition>(
  rawActivities
);
