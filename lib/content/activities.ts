import { ActivityDefinition } from "../activity";
import { getHealthRegenWhileResting, heal } from "../creatureUtils";
import { finishRegistry, RawRegistry } from "../registry";
import { dungeons } from "./dungeons";

export type ActivityId = "resting" | "onExpedition";

const rawActivities = {
  resting: {
    description: "Resting",
    tick: (creature, gameContext) => {
      const regen = getHealthRegenWhileResting(creature, gameContext);
      heal(creature, regen, gameContext);
    },
  },
  onExpedition: {
    description: (creature, gameContext) => {
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
