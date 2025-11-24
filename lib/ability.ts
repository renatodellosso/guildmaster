import { Combat } from "./combat";
import { CreatureInstance, RegistryToCreatureDefId } from "./creature";
import { RegistryContext } from "./registry";
import { getFromOptionalFunc, OptionalFunc } from "./utilTypes";

export enum AbilityPriority {
  Low = 0,
  Medium = 50,
  High = 100,
  Max = 150,
}

export type AbilityFuncParams<TRegistryContext extends RegistryContext> = [
  caster: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  targets: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[],
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext,
];

export type AbilityFuncParamsWithoutTargets<
  TRegistryContext extends RegistryContext,
> = [
  caster: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext,
];

export type Ability<TRegistryContext extends RegistryContext> = {
  name: string;
  description: string;
  activate: (...args: AbilityFuncParams<TRegistryContext>) => void;
  selectTargets: (
    ...args: AbilityFuncParamsWithoutTargets<TRegistryContext>
  ) => CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[];
  canActivate: OptionalFunc<boolean, AbilityFuncParams<TRegistryContext>>;
  priority: OptionalFunc<AbilityPriority, AbilityFuncParams<TRegistryContext>>;
};

export function getAbilities<TRegistryContext extends RegistryContext>(
  creature: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext>[] {
  const creatureDef = registryContext.creatures[creature.definitionId];

  return creatureDef.abilities.map((ability) =>
    getFromOptionalFunc(ability, creature, combat, registryContext)
  );
}

export function getCastableAbilities<TRegistryContext extends RegistryContext>(
  creature: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext>[] {
  const allAbilities = getAbilities(creature, combat, registryContext);

  return allAbilities.filter((ability) =>
    getFromOptionalFunc(
      ability.canActivate,
      creature,
      [],
      combat,
      registryContext
    )
  );
}
