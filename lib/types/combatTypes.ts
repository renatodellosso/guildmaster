import { CreatureInstance, RegistryToCreatureDefId } from "./creature";
import { RegistryContext } from "./registry";

export type Combat<TRegistryContext extends RegistryContext> = {
  attacker: CombatSide<TRegistryContext>;
  defender: CombatSide<TRegistryContext>;
};

export type CombatSide<TRegistryContext extends RegistryContext> =
  CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[];
