import { ClassId as ClassId } from "./content/classes";
import { CreatureInstance, CreatureProvider } from "./creature";
import { GameContext } from "./gameContext";
import { OptionalFunc } from "./utilTypes";

export type ClassDefinition = CreatureProvider & {
  id: ClassId;
  name: string;
  description: string;
  canSelect: OptionalFunc<boolean, [CreatureInstance, GameContext]>;
};
