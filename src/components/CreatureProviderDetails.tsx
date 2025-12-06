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
    getFromOptionalFunc(provider.maxHealth, creature!, 0, context.game, source);
  const healthRegen =
    provider.healthRegen &&
    getFromOptionalFunc(
      provider.healthRegen,
      creature!,
      0,
      context.game,
      source
    );

  const skills = Object.entries(provider.skills || {}).reduce(
    (acc, [skillId, func]) => {
      const bonus = getFromOptionalFunc(
        func,
        creature!,
        0,
        context.game,
        source
      );
      if (bonus !== 0) {
        acc[skillId] = bonus;
      }
      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

  const stats = {
    "Max Health": maxHealth,
    "Health Regen": healthRegen,
    ...skills,
  };

  const resistances = provider.resistances
    ? getFromOptionalFunc(provider.resistances, creature!, context.game, source)
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
        return (
          <div key={statName}>
            {statName}: {formatBonus(stat)}
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
