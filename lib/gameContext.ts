import { CreatureInstance } from "./creature";
import { Expedition } from "./expedition";
import { RegistryContext, RegistryToCreatureDefId } from "./registry";
import { Id } from "./utilTypes";

export type GameContext<TRegistryContext extends RegistryContext> = {
  lastTick: number;

  roster: {
    [id: Id]: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>;
  };
  expeditions: Expedition<TRegistryContext>[];
};
