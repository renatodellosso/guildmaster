import { ActivityId } from "./content/activities";
import {
  GameContext,
  MainRegistryContext,
} from "./content/mainRegistryContext";
import { CreatureInstance } from "./creature";
import { OptionalFunc } from "./utilTypes";

export type ActivityDefinition = {
  id: ActivityId;
  getDescription: OptionalFunc<
    string,
    [CreatureInstance<MainRegistryContext>, GameContext, MainRegistryContext]
  >;
};

export type ActivityInstance = {
  definitionId: ActivityId;
  data?: unknown;
};
