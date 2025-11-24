import { RegistryContext } from "./registry";
import { OptionalFunc } from "./utilTypes";

export enum SkillId {
  Melee = "melee",
  Ranged = "ranged",
  Magic = "magic",
}

export type SkillList<
  TRegistryContext extends RegistryContext,
  TArgs extends unknown[] = [],
> = {
  [key in SkillId]?: OptionalFunc<number, [TRegistryContext, ...TArgs]>;
};
