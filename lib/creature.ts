import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { RegistryContext, RegistryToCreatureDefId } from "./registry";
import { SkillList } from "./skills";
import { Id, OptionalFunc } from "./utilTypes";


export type CreatureDefinition<
  TRegistryContext extends RegistryContext = RegistryContext,
> = {
  id: RegistryToCreatureDefId<TRegistryContext>;
  name: string;
  skills: SkillList<
    TRegistryContext,
    [CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>]
  >;
  abilities?: OptionalFunc<
    Ability<TRegistryContext>[],
    AbilityFuncParamsWithoutTargets<TRegistryContext>
  >;
};

export type CreatureInstance<TDefId extends Id> = {
  id: Id;
  definitionId: TDefId;

  hp: number;
};
