import { ActivityId } from "./content/activities";
import { GameContext } from "./gameContext";
import { CreatureInstance } from "./creature";
import { OptionalFunc } from "./utilTypes";

export type ActivityDefinition = {
  id: ActivityId;
  getDescription: OptionalFunc<string, [CreatureInstance, GameContext]>;
};

export type ActivityInstance = {
  definitionId: ActivityId;
  data?: unknown;
};
