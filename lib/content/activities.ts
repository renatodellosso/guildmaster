import { ActivityDefinition } from "../activity";
import { finishRegistry, RawRegistry } from "../registry";

export type ActivityId = "resting" | "onExpedition";

const rawActivities = {
  resting: {
    getDescription: "Resting",
  },
  onExpedition: {
    getDescription: (creature, gameContext, registryContext) => {
      const expedition = gameContext.expeditions.find((expedition) =>
        expedition.party.includes(creature.id)
      );

      const dungeonName = expedition
        ? registryContext.dungeons[expedition.dungeonId].name
        : "an unknown location";

      return `On Expedition in ${dungeonName}`;
    },
  },
} satisfies RawRegistry<ActivityId, ActivityDefinition>;

export const activities = finishRegistry<ActivityId, ActivityDefinition>(
  rawActivities
);
