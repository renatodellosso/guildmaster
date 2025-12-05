import { ActivityId } from "./content/activities";
import { GameContext } from "./gameContext";
import { CreatureInstance } from "./creature";
import { OptionalFunc, Tickable } from "./utilTypes";

export type ActivityDefinition = Tickable<CreatureInstance> & {
  id: ActivityId;
  description: OptionalFunc<string, [CreatureInstance, GameContext]>;
  /**
   * Defaults to 1 if not specified.
   */
  healthRegenMultiplier?: number;
};

export type ActivityInstance = {
  definitionId: ActivityId;
  data?: unknown;
};
