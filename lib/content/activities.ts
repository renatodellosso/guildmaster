import { ActivityDefinition } from "../activity";
import { finishRegistry, RawRegistry } from "../registry";
import { dungeons } from "./dungeons";

export type ActivityId = "resting" | "onExpedition";

const rawActivities = {
  resting: {
    getDescription: "Resting",
  },
  onExpedition: {
    getDescription: (creature, gameContext) => {
      const expedition = gameContext.expeditions.find((expedition) =>
        expedition.party.includes(creature.id)
      );

      const dungeonName = expedition
        ? dungeons[expedition.dungeonId].name
        : "an unknown location";

      return `On Expedition in ${dungeonName}`;
    },
  },
} satisfies RawRegistry<ActivityId, ActivityDefinition>;

export const activities = finishRegistry<ActivityId, ActivityDefinition>(
  rawActivities
);
