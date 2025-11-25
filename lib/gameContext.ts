import { Combat } from "./combat";
import { CreatureInstance } from "./creature";
import { RegistryContext, RegistryToCreatureDefId } from "./registry";
import { Id } from "./utilTypes";

export type GameContext<TRegistryContext extends RegistryContext> = {
  roster: {
    [id: Id]: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>;
  };
  combats: Combat<TRegistryContext>[];
};
