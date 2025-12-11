import { items } from "@/lib/content/items";
import { formatBonus } from "@/lib/format";
import { GameProvider, GameProviderSource } from "@/lib/gameContext";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function GameProviderDetails({
  provider,
  source,
  context,
}: {
  provider: GameProvider;
  source: GameProviderSource | undefined;
  context: Context;
}) {
  const maxRosterSize =
    provider.maxRosterSize &&
    getFromOptionalFunc(provider.maxRosterSize, {
      provider,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const maxPartySize =
    provider.maxPartySize &&
    getFromOptionalFunc(provider.maxPartySize, {
      provider,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const maxExpeditions =
    provider.maxExpeditions &&
    getFromOptionalFunc(provider.maxExpeditions, {
      provider,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const recruitmentCost =
    provider.recruitmentCost &&
    getFromOptionalFunc(provider.recruitmentCost, {
      provider,
      prev: [],
      gameContext: context.game,
      source,
    });
  const startingSkillChance =
    provider.startingSkillChance &&
    getFromOptionalFunc(provider.startingSkillChance, {
      provider,
      prev: 0,
      gameContext: context.game,
      source,
    });
  const sellValueMultiplier =
    provider.sellValueMultiplier &&
    getFromOptionalFunc(provider.sellValueMultiplier, {
      provider,
      prev: 0.5,
      gameContext: context.game,
      source,
    });

  const stats = {
    "Max Roster Size": maxRosterSize,
    "Max Party Size": maxPartySize,
    "Max Expeditions": maxExpeditions,
  };

  const percentStats = {
    "Starting Skill Chance": startingSkillChance,
    "Sell Value Multiplier": sellValueMultiplier,
  };

  return (
    <div>
      {Object.entries(stats).map(
        ([statName, value]) =>
          value !== undefined && (
            <div key={statName}>
              {statName}: {formatBonus(value)}
            </div>
          )
      )}
      {Object.entries(percentStats).map(
        ([statName, value]) =>
          value !== undefined && (
            <div key={statName}>
              {statName}: {formatBonus(value, "percent")}
            </div>
          )
      )}
      {recruitmentCost && recruitmentCost.length > 0 && (
        <div>
          Recruitment Cost:
          <ul>
            {recruitmentCost.map((cost) => (
              <li key={cost.definitionId}>
                {formatBonus(cost.amount)}x {items[cost.definitionId].name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
