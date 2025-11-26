import { MainRegistryContext } from "@/lib/content/mainRegistryContext";
import { createExpedition } from "@/lib/expedition";
import { RegistryToDungeonId } from "@/lib/registry";
import { Context } from "@/lib/utilTypes";
import { useState } from "react";

export default function StartExpeditionMenu({
  context,
  onStartExpedition,
}: {
  context: Context;
  onStartExpedition: () => void;
}) {
  const [dungeonId, setDungeonId] =
    useState<RegistryToDungeonId<MainRegistryContext>>();
  const [error, setError] = useState<string>();

  function start() {
    if (!dungeonId) {
      setError("No dungeon selected");
      return;
    }
    const dungeon = context.registry.dungeons[dungeonId];
    if (!dungeon) {
      setError("Invalid dungeon selected");
      return;
    }

    context.game.expeditions.push(
      createExpedition(dungeonId, [], context.registry)
    );
    context.updateGameState();

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
          <option value="">Select a dungeon</option>
          {Object.values(context.registry.dungeons).map((dungeon, index) => (
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
