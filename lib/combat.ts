import { CreatureInstance, RegistryToCreatureDefId } from "./creature";
import { RegistryContext } from "./registry";

export type Combat<TRegistryContext extends RegistryContext> = {
  allies: CombatSide<TRegistryContext>;
  enemies: CombatSide<TRegistryContext>;
};

export type CombatSide<TRegistryContext extends RegistryContext> =
  CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[];