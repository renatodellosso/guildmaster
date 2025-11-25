import { Combat } from "./combat";
import { RegistryContext } from "./registry";

export type Expedition<TRegistryContext extends RegistryContext> = {
  combat: Combat<TRegistryContext>;
};