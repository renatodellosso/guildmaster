import {
  CreatureInstance,
  CreatureProvider,
  CreatureProviderSource,
} from "@/lib/creature";
import { formatBonus, titleCase, formatPercent } from "@/lib/format";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import AbilityDescription from "./AbilityDescription";

export default function CreatureProviderDetails({
  provider,
  source,
  creature,
  context,
}: {
  provider: CreatureProvider;
  source: CreatureProviderSource | undefined;
  creature: CreatureInstance | undefined;
  context: Context;
}) {
  const maxHealth =
    provider.maxHealth &&
    getFromOptionalFunc(provider.maxHealth, {
      creature: creature!,
      source,
      gameContext: context.game,
      prev: 0,
    });
  const healthRegen =
    provider.healthRegen &&
    getFromOptionalFunc(provider.healthRegen, {
      creature: creature!,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const actionsPerTurn =
    provider.actionsPerTurn &&
    getFromOptionalFunc(provider.actionsPerTurn, {
      creature: creature!,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const constructionPerTick =
    provider.constructionPerTick &&
    getFromOptionalFunc(provider.constructionPerTick, {
      creature: creature!,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const xpMultiplier =
    provider.xpMultiplier &&
    getFromOptionalFunc(provider.xpMultiplier, {
      creature: creature!,
      prev: 0,
      gameContext: context.game,
      source,
    });

  const skills = Object.entries(provider.skills || {}).reduce(
    (acc, [skillId, func]) => {
      const bonus = getFromOptionalFunc(func, {
        creature: creature!,
        prev: 0,
        gameContext: context.game,
        source,
      });
      if (bonus !== 0) {
        acc[skillId] = bonus;
      }
      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

  const stats: {
    [key: string]:
      | number
      | undefined
      | {
          val: number | undefined;
          format: "int" | "percent";
        };
  } = {
    "Max Health": maxHealth,
    "Health Regen": healthRegen,
    "Actions Per Turn": actionsPerTurn,
    "Construction Per Tick": constructionPerTick,
    "XP Multiplier": {
      val: xpMultiplier,
      format: "percent",
    },
    ...skills,
  };

  const resistances = provider.resistances
    ? getFromOptionalFunc(provider.resistances, {
        creature: creature!,
        gameContext: context.game,
        source,
      })
    : {};

  const abilities =
    provider.abilities &&
    getFromOptionalFunc(
      provider.abilities,
      creature!,
      undefined,
      context.game,
      source
    );

  return (
    <>
      {Object.entries(stats).map(([statName, stat]) => {
        if (stat === undefined) return null;
        const format =
          typeof stat === "object" && "format" in stat ? stat.format : "int";
        const value =
          typeof stat === "object" && "val" in stat ? stat.val : stat;
        if (value === undefined) return null;

        return (
          <div key={statName}>
            {statName}: {formatBonus(value, format)}
          </div>
        );
      })}
      {resistances && Object.entries(resistances).length > 0 && (
        <div>
          <strong>Resistances:</strong>
          {Object.entries(resistances).map(([resistanceType, value]) => (
            <div key={resistanceType}>
              {titleCase(resistanceType)}: {formatPercent(value)}
            </div>
          ))}
        </div>
      )}
      {abilities && abilities.length > 0 && (
        <div>
          <strong>Abilities:</strong>
          {abilities.map((ability, index) => (
            <AbilityDescription
              ability={{
                ability: ability,
                source,
              }}
              key={index}
            />
          ))}
        </div>
      )}
    </>
  );
}
