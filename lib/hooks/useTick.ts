import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";
import { useCallback, useEffect, useState } from "react";
import { tick } from "../tick";
import { saveGame } from "../saveUtils";

export default function useTick(
  gameContext: GameContext,
  setGameContext: (context: GameContext) => void,
  registry: TRegistryContext,
  ticksPerSecond: number = 1,
  saveInterval: number = 10
) {
  const [, setSaveCounter] = useState(0);
  const [lastSaveAt, setLastSaveAt] = useState<number>();
  const [lastDelta, setLastDelta] = useState<number>();

  const handleTick = useCallback(() => {
    const now = Date.now();
    const delta = (now - gameContext.lastTick) / 1000; // delta in seconds
    setLastDelta(delta);

    tick(gameContext, registry);

    setGameContext({
      ...gameContext,
      lastTick: now,
    });

    setSaveCounter((prev) => {
      prev += delta;

      if (prev >= saveInterval) {
        saveGame(gameContext);
        setLastSaveAt(now);
        prev = 0;
      }

      return prev;
    });
  }, [gameContext, registry, setGameContext, saveInterval]);

  useEffect(() => {
    const interval = setInterval(handleTick, 1000 / ticksPerSecond);
    return () => clearInterval(interval);
  }, [gameContext, setGameContext, registry, ticksPerSecond, handleTick]);

  return { lastSaveAt, lastDelta };
}
