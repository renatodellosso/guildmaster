import { creatures } from "./content/creatures";
import { CreatureInstance } from "./creature";
import { Expedition } from "./expedition";
import { GameContext } from "./gameContext";
import { getFromOptionalFunc, Id, OptionalFunc } from "./utilTypes";

export enum AbilityPriority {
  Low = 0,
  Medium = 50,
  High = 100,
  Max = 150,
}

export type AbilityFuncParams = [
  caster: CreatureInstance,
  targets: CreatureInstance[],
  expedition: Expedition,
  gameContext: GameContext,
];

export type AbilityFuncParamsWithoutTargets = [
  caster: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext,
];

export type Ability = {
  name: string;
  description: string;
  activate: (...args: AbilityFuncParams) => void;
  selectTargets: (
    ...args: AbilityFuncParamsWithoutTargets
  ) => (Id | CreatureInstance)[];
  canActivate: OptionalFunc<boolean, AbilityFuncParams>;
  priority: OptionalFunc<AbilityPriority, AbilityFuncParams>;
};

export function getAbilities(
  creature: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext
): Ability[] {
  const creatureDef = creatures[creature.definitionId];

  if (!creatureDef.abilities) {
    return [];
  }

  return getFromOptionalFunc(
    creatureDef.abilities,
    creature,
    expedition,
    gameContext
  );
}

export function getCastableAbilities(
  creature: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext
): Ability[] {
  const allAbilities = getAbilities(creature, expedition, gameContext);

  return allAbilities.filter((ability) =>
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
  abilities: Ability[],
  caster: CreatureInstance,
  targets: CreatureInstance[],
  expedition: Expedition,
  gameContext: GameContext
): Ability[] {
  let highestPriority = -Infinity;

  const abilitiesWithPriorities = abilities.map((ability) => {
    const priority = getFromOptionalFunc(
      ability.priority,
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

export function selectAbilityFromList(abilities: Ability[]) {
  if (abilities.length === 0) {
    return undefined;
  }
  return abilities[Math.floor(Math.random() * abilities.length)];
}

export function selectAbilityForCreature(
  creature: CreatureInstance,
  expedition: Expedition,
  gameContext: GameContext
): Ability | undefined {
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
