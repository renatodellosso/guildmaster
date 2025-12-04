import { ActivityId } from "./content/activities";
import { GameContext } from "./gameContext";
import { CreatureInstance } from "./creature";
import { OptionalFunc } from "./utilTypes";

export type ActivityDefinition = {
  id: ActivityId;
  description: OptionalFunc<string, [CreatureInstance, GameContext]>;
  tick?: (creature: CreatureInstance, gameContext: GameContext) => void;
};

export type ActivityInstance = {
  definitionId: ActivityId;
  data?: unknown;
};
