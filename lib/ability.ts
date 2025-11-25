import { Combat } from "./combat";
import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
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
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext,
];

export type AbilityFuncParamsWithoutTargets<
  TRegistryContext extends RegistryContext,
> = [
  caster: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  gameContext: GameContext<TRegistryContext>,
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
  gameContext: GameContext<TRegistryContext>,
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
    gameContext,
    registryContext
  );
}

export function getCastableAbilities<TRegistryContext extends RegistryContext>(
  creature: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext>[] {
  const allAbilities = getAbilities(
    creature,
    combat,
    gameContext,
    registryContext
  );

  return allAbilities.filter((ability) =>
    getFromOptionalFunc(
      ability.canActivate,
      creature,
      [],
      combat,
      gameContext,
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
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext>[] {
  let highestPriority = -Infinity;

  const abilitiesWithPriorities = abilities.map((ability) => {
    const priority = getFromOptionalFunc(
      ability.priority,
      caster,
      targets,
      combat,
      gameContext,
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
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
): Ability<TRegistryContext> | undefined {
  const castableAbilities = getCastableAbilities(
    creature,
    combat,
    gameContext,
    registryContext
  );

  const highestPriorityAbilities = getHighestPriorityAbilities(
    castableAbilities,
    creature,
    [],
    combat,
    gameContext,
    registryContext
  );

  return selectAbilityFromList(highestPriorityAbilities);
}
