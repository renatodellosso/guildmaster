import { RetreatTriggerDefinition } from "../combat";

export type RetreatTriggerId = "alwaysRetreat" | "neverRetreat";

export const retreatTriggers = {
  alwaysRetreat: {
    shouldRetreat: () => true,
    canSelect: false,
  },
  neverRetreat: {
    shouldRetreat: () => false,
    canSelect: false,
  },
} as {
  [id in RetreatTriggerId]: RetreatTriggerDefinition;
};
