import { ClassId as ClassId } from "./content/classes";
import {
  CreatureInstance,
  CreatureProvider,
  CreatureProviderSource,
} from "./creature";
import { GameContext } from "./gameContext";
import { getFromOptionalFunc, OptionalFunc } from "./utilTypes";

export type ClassDefinition = CreatureProvider & {
  id: ClassId;
  name: string;
  description: OptionalFunc<
    string,
    [CreatureInstance | undefined, GameContext, CreatureProviderSource]
  >;
  canSelect: OptionalFunc<boolean, [CreatureInstance, GameContext]>;
  canSelectText: string;
};

export function buildClassDescription(
  base: string,
  features: {
    [minLevel: number]: string;
  }
): ClassDefinition["description"] {
  return (_creature, _gameContext, source) => {
    let desc = base || "";
    const level = source as number;
    const sortedLevels = Object.keys(features)
      .map((k) => parseInt(k))
      .sort((a, b) => a - b);
    for (const minLevel of sortedLevels) {
      if (level >= minLevel) {
        desc += `\n\nLevel ${minLevel}+: ${features[minLevel]}`;
      }
    }
    return desc;
  };
}

export function requireLevel<T>(
  values: {
    [minLevel: number]: OptionalFunc<
      T,
      [CreatureInstance, GameContext, CreatureProviderSource | undefined]
    >[];
  },
  creature: CreatureInstance,
  gameContext: GameContext,
  source: CreatureProviderSource | undefined
): T[] {
  const level = source as number;
  const result: T[] = [];

  const sortedLevels = Object.keys(values)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);
  for (const minLevel of sortedLevels) {
    if (level >= minLevel) {
      for (const valFunc of values[minLevel]) {
        result.push(
          getFromOptionalFunc(valFunc, creature, gameContext, source)
        );
      }
    }
  }

  return result;
}
