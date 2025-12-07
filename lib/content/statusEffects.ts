import { getMaxHealth, heal, takeDamage } from "../creatureUtils";
import { DamageType, DamageTypeGroups } from "../damage";
import { formatPercent } from "../format";
import { RawRegistry, finishRegistry } from "../registry";
import { StatusEffectDefinition, StatusEffectInstance } from "../statusEffect";

export type StatusEffectId =
  | "poisoned"
  | "ward"
  | "divine_shield"
  | "vampirism";

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
        undefined,
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
        [DamageTypeGroups.All]: 0.1 * (source as StatusEffectInstance).strength,
      };
    },
  },
  divine_shield: {
    name: "Divine Shield",
    description: () => "Negates all incoming damage.",
    resistances: (_creature, _gameContext, source) => ({
      [DamageTypeGroups.All]: (source as StatusEffectInstance).strength,
    }),
  },
  vampirism: {
    name: "Vampirism",
    description: "This person is a vampire.",
    allowDuplicate: false,
    maxHealth: -50,
    resistances: {
      [DamageType.Radiant]: -0.5,
      [DamageType.Fire]: -0.5,
      [DamageType.Necrotic]: 0.3,
    },
    tick: ({ creature, source }, gameContext) => {
      heal(creature, (source as StatusEffectInstance).strength, gameContext);
    },
  },
} satisfies RawRegistry<StatusEffectId, StatusEffectDefinition>;

export const statusEffects = finishRegistry<
  StatusEffectId,
  StatusEffectDefinition
>(rawStatusEffects);
