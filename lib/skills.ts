import { OptionalFunc } from "./utilTypes";

export enum SkillId {
  Melee = "Melee",
  Ranged = "Ranged",
  Magic = "Magic",
  Endurance = "Endurance",
  Construction = "Construction",
}

export type SkillList<TArgs extends unknown[] = []> = {
  [key in SkillId]?: OptionalFunc<number, TArgs>;
};
