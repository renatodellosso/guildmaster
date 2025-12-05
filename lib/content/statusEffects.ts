import { getMaxHealth, takeDamage } from "../creatureUtils";
import { DamageType } from "../damage";
import { formatPercent } from "../format";
import { RawRegistry, finishRegistry } from "../registry";
import { StatusEffectDefinition, StatusEffectInstance } from "../statusEffect";

export type StatusEffectId = "poisoned";

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
} satisfies RawRegistry<StatusEffectId, StatusEffectDefinition>;

export const statusEffects = finishRegistry<
  StatusEffectId,
  StatusEffectDefinition
>(rawStatusEffects);
