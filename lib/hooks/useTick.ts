import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";
import { useEffect } from "react";
import { tick } from "../tick";

export default function useTick<TRegistryContext extends RegistryContext>(
  gameContext: GameContext<TRegistryContext>,
  setGameContext: (context: GameContext<TRegistryContext>) => void,
  registry: TRegistryContext,
  ticksPerSecond: number = 1
) {
  function handleTick() {
    const now = Date.now();
    const delta = (now - gameContext.lastTick) / 1000; // delta in seconds

    tick(gameContext, registry);

    setGameContext({
      ...gameContext,
      lastTick: now,
    });
  }

  useEffect(() => {
    const interval = setInterval(handleTick, 1000 / ticksPerSecond);
    return () => clearInterval(interval);
  }, [gameContext, setGameContext, registry, ticksPerSecond]);
}
