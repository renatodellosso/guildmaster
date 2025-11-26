import { createExpedition } from "@/lib/expedition";
import { GameContext } from "@/lib/gameContext";
import { RegistryContext, RegistryToDungeonId } from "@/lib/registry";
import { useState } from "react";

export default function StartExpeditionMenu<
  TRegistryContext extends RegistryContext,
>({
  gameContext,
  registry,
  onStartExpedition,
}: {
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
  onStartExpedition: () => void;
}) {
  const [dungeonId, setDungeonId] =
    useState<RegistryToDungeonId<TRegistryContext>>();
  const [error, setError] = useState<string>();

  function start() {
    if (!dungeonId) {
      setError("No dungeon selected");
      return;
    }
    const dungeon = registry.dungeons[dungeonId];
    if (!dungeon) {
      setError("Invalid dungeon selected");
      return;
    }

    gameContext.expeditions.push(createExpedition(dungeonId, [], registry));

    onStartExpedition();
  }

  return (
    <div>
      <h2>Start Expedition</h2>
      <div className="flex gap-1">
        <p>Dungeon:</p>
        <select
          onChange={(e) => setDungeonId(e.target.value as typeof dungeonId)}
        >
          {Object.values(registry.dungeons).map((dungeon, index) => (
            <option key={index} value={String(dungeon.id)}>
              {dungeon.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={start}>Start Expedition</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
