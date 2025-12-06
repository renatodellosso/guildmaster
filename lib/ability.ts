import { AbilityPriority } from "./abilityPriority";
import { CreatureInstance, CreatureProviderSource } from "./creature";
import { getProviders } from "./creatureUtils";
import { Expedition } from "./expedition";
import { GameContext } from "./gameContext";
import { getFromOptionalFunc, Id, OptionalFunc } from "./utilTypes";

export type AbilityFuncParams = [
  caster: CreatureInstance,
  targets: CreatureInstance[],
  expedition: Expedition | undefined,
  gameContext: GameContext,
];

export type AbilityFuncParamsWithoutTargets = [
  caster: CreatureInstance,
  expedition: Expedition | undefined,
  gameContext: GameContext,
  source: CreatureProviderSource,
];

export type Ability = {
  name: string;
  description: string;
  activate: (...args: AbilityFuncParams) => void;
  selectTargets: (
    ...args: [CreatureInstance, Expedition, GameContext, CreatureProviderSource]
  ) => (Id | CreatureInstance)[];
  canActivate: OptionalFunc<boolean, AbilityFuncParams>;
  priority: OptionalFunc<AbilityPriority, AbilityFuncParams>;
};

export type AbilityWithSource = {
  ability: Ability;
  source: CreatureProviderSource;
};

export function getAbilities(
  creature: CreatureInstance,
  expedition: Expedition | undefined,
  gameContext: GameContext
): AbilityWithSource[] {
  const providers = getProviders(creature);

  const abilities: AbilityWithSource[] = [];

  for (const provider of providers) {
    if (!provider.def.abilities) {
      continue;
    }

    const providerAbilities = getFromOptionalFunc(
      provider.def.abilities,
      creature,
      expedition,
      gameContext,
      provider.source
    );

    for (const ability of providerAbilities) {
      abilities.push({ ability, source: provider.source });
    }
  }

  return abilities;
}
export function getCastableAbilities(
  creature: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext
): AbilityWithSource[] {
  const allAbilities = getAbilities(creature, expedition, gameContext);

  return allAbilities.filter(({ ability }) =>
    getFromOptionalFunc(
      ability.canActivate,
      creature,
      [],
      expedition,
      gameContext
    )
  );
}

export function getHighestPriorityAbilities(
  abilities: AbilityWithSource[],
  caster: CreatureInstance,
  targets: CreatureInstance[],
  expedition: Expedition,
  gameContext: GameContext
): AbilityWithSource[] {
  let highestPriority = -Infinity;

  const abilitiesWithPriorities = abilities.map((ability) => {
    const priority = getFromOptionalFunc(
      ability.ability.priority,
      caster,
      targets,
      expedition,
      gameContext
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

export function selectAbilityFromList(abilities: AbilityWithSource[]) {
  if (abilities.length === 0) {
    return undefined;
  }
  return abilities[Math.floor(Math.random() * abilities.length)];
}

export function selectAbilityForCreature(
  creature: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext
): { ability: Ability; source: CreatureProviderSource } | undefined {
  const castableAbilities = getCastableAbilities(
    creature,
    expedition,
    gameContext
  );

  const highestPriorityAbilities = getHighestPriorityAbilities(
    castableAbilities,
    creature,
    [],
    expedition,
    gameContext
  );

  return selectAbilityFromList(highestPriorityAbilities);
}
