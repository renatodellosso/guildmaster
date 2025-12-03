import { OptionalFunc } from "./utilTypes";

export enum SkillId {
  Melee = "melee",
  Ranged = "ranged",
  Magic = "magic",
}

export type SkillList<TArgs extends unknown[] = []> = {
  [key in SkillId]?: OptionalFunc<number, TArgs>;
};
