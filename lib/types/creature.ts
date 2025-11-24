import { RegistryContext } from "./registry";
import { SkillList } from "./skills";
import { Id } from "./utilTypes";

export type RegistryToCreatureDefId<TRegistryContext extends RegistryContext> =
  TRegistryContext["creatures"] extends Record<infer TDefId, unknown>
    ? TDefId
    : string;

export type CreatureDefinition<
  TRegistryContext extends RegistryContext = RegistryContext,
> = {
  id: RegistryToCreatureDefId<TRegistryContext>;
  name: string;
  skills: SkillList<
    TRegistryContext,
    [CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>]
  >;
};

export type CreatureInstance<TDefId extends Id> = {
  id: Id;
  definitionId: TDefId;

  hp: number;
};
