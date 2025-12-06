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
    getFromOptionalFunc(
      provider.maxRosterSize,
      provider,
      0,
      context.game,
      source
    );
  const maxPartySize =
    provider.maxPartySize &&
    getFromOptionalFunc(
      provider.maxPartySize,
      provider,
      0,
      context.game,
      source
    );

  const stats = {
    "Max Roster Size": maxRosterSize,
    "Max Party Size": maxPartySize,
  };

  return (
    <div>
      {Object.entries(stats).map(([statName, value]) =>
        value !== undefined ? (
          <div key={statName}>
            {statName}: {formatBonus(value)}
          </div>
        ) : null
      )}
    </div>
  );
}
