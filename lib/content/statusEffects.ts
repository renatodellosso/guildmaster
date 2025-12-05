import { getMaxHealth, takeDamage } from "../creatureUtils";
import { DamageType, DamageTypeGroups } from "../damage";
import { formatPercent } from "../format";
import { RawRegistry, finishRegistry } from "../registry";
import { StatusEffectDefinition, StatusEffectInstance } from "../statusEffect";

export type StatusEffectId = "poisoned" | "ward";

const rawStatusEffects = {
  poisoned: {
    name: "Poisoned",
    description: (_creature, instance, _gameContext) =>
      `Deals ${formatPercent(0.005 * instance.strength)} of max HP as poison damage each turn.`,
    tick: ({ creature, source }, gameContext) => {
      const instance = source as StatusEffectInstance;
      const damage =
        getMaxHealth(creature, gameContext) * 0.005 * instance.strength;
      takeDamage(
        creature,
        [
          {
            type: DamageType.Poison,
            amount: damage,
          },
        ],
        gameContext
      );
    },
  },
  ward: {
    name: "Ward",
    description: (_creature, instance, _gameContext) =>
      `Reduces incoming magic damage by ${formatPercent(
        0.1 * instance.strength
      )}.`,
    resistances: (_creature, _gameContext, source) => {
      return {
        [DamageTypeGroups.All]: Math.max(
          1 - Math.pow(0.9, (source as StatusEffectInstance).strength),
          0.5
        ),
      };
    },
  },
} satisfies RawRegistry<StatusEffectId, StatusEffectDefinition>;

export const statusEffects = finishRegistry<
  StatusEffectId,
  StatusEffectDefinition
>(rawStatusEffects);
