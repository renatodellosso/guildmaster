import { ClassId as ClassId } from "./content/classes";
import {
  CreatureInstance,
  CreatureProvider,
  CreatureProviderSource,
} from "./creature";
import { GameContext } from "./gameContext";
import { OptionalFunc } from "./utilTypes";

export type ClassDefinition = CreatureProvider & {
  id: ClassId;
  name: string;
  description: OptionalFunc<
    string,
    [CreatureInstance, GameContext, CreatureProviderSource]
  >;
  canSelect: OptionalFunc<boolean, [CreatureInstance, GameContext]>;
};
