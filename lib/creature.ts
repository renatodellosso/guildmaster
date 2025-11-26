import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { RegistryContext, RegistryToCreatureId } from "./registry";
import { SkillList } from "./skills";
import { randomId } from "./utils";
import { Id, OptionalFunc } from "./utilTypes";

export type CreatureDefinition<
  TRegistryContext extends RegistryContext = RegistryContext,
> = {
  id: RegistryToCreatureId<TRegistryContext>;
  name: string;
  skills: SkillList<
    TRegistryContext,
    [CreatureInstance<RegistryToCreatureId<TRegistryContext>>]
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

export function createCreatureInstance<
  TRegistryContext extends RegistryContext,
>(
  defId: RegistryToCreatureId<TRegistryContext>
): CreatureInstance<RegistryToCreatureId<TRegistryContext>> {
  return {
    id: randomId(),
    definitionId: defId,
    hp: 100,
  };
}
