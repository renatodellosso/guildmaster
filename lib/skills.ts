import { OptionalFunc } from "./utilTypes";

export enum SkillId {
  Melee = "Melee",
  Ranged = "Ranged",
  Magic = "Magic",
  Endurance = "Endurance",
}

export type SkillList<TArgs extends unknown[] = []> = {
  [key in SkillId]?: OptionalFunc<number, TArgs>;
};
