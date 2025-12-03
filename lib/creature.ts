import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { ActivityInstance } from "./activity";
import { CreatureDefId, creatures } from "./content/creatures";
import { SkillList } from "./skills";
import { randomId } from "./utils";
import { Id, OptionalFunc } from "./utilTypes";

export type CreatureDefinition = {
  id: CreatureDefId;
  name: string;
  skills: SkillList<[CreatureInstance]>;
  abilities?: OptionalFunc<Ability[], AbilityFuncParamsWithoutTargets>;
};

export type CreatureInstance = {
  id: Id;
  definitionId: CreatureDefId;
  name: string;

  hp: number;
};

export type AdventurerInstance = CreatureInstance & {
  activity: ActivityInstance;
};

export function createCreatureInstance(defId: CreatureDefId): CreatureInstance {
  return {
    id: randomId(),
    definitionId: defId,
    name: creatures[defId].name,
    hp: 100,
  };
}
