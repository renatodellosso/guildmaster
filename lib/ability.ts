import { Combat } from "./combat";
import { CreatureInstance } from "./creature";
import { RegistryContext, RegistryToCreatureDefId } from "./registry";
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

  if (!creatureDef.abilities) {
    return [];
  }

  return getFromOptionalFunc(
    creatureDef.abilities,
    creature,
    combat,
    registryContext
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

export function getHighestPriorityAbilities<
  TRegistryContext extends RegistryContext,
>(
  abilities: Ability<TRegistryContext>[],
  caster: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  targets: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[],
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext>[] {
  let highestPriority = -Infinity;

  const abilitiesWithPriorities = abilities.map((ability) => {
    const priority = getFromOptionalFunc(
      ability.priority,
      caster,
      targets,
      combat,
      registryContext
    );

    if (priority > highestPriority) {
      highestPriority = priority;
    }

    return { ability, priority };
  });

  return abilitiesWithPriorities
    .filter(({ priority }) => priority === highestPriority)
    .map(({ ability }) => ability);
}

export function selectAbilityFromList<TRegistryContext extends RegistryContext>(
  abilities: Ability<TRegistryContext>[]
) {
  if (abilities.length === 0) {
    return undefined;
  }
  return abilities[Math.floor(Math.random() * abilities.length)];
}

export function selectAbilityForCreature<
  TRegistryContext extends RegistryContext,
>(
  creature: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext> | undefined {
  const castableAbilities = getCastableAbilities(
    creature,
    combat,
    registryContext
  );

  const highestPriorityAbilities = getHighestPriorityAbilities(
    castableAbilities,
    creature,
    [],
    combat,
    registryContext
  );

  return selectAbilityFromList(highestPriorityAbilities);
}
