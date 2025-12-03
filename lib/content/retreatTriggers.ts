import { RetreatTriggerDefinition } from "../combat";

export type RetreatTriggerId = string;

export const retreatTriggers = {} as {
  [id in RetreatTriggerId]: RetreatTriggerDefinition;
};
