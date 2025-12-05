import { tick } from "@/lib/tick";
import { Context } from "@/lib/utilTypes";
import { useEffect, useState } from "react";

export function OfflineProgressWindow({
  context,
  finish,
}: {
  context: Context;
  finish: () => void;
}) {
  const [ticksRemaining, setTicksRemaining] = useState<number>(-1);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const now = Date.now();
    const deltaSeconds = (now - context.game.lastTick) / 1000;
    const ticksToProcess = Math.floor(deltaSeconds);
    setTicksRemaining(ticksToProcess);

    let ticksProcessed = 0;
    function processTick() {
      if (ticksProcessed < ticksToProcess) {
        tick(context.game);
        context.updateGameState();

        ticksProcessed++;
        setTicksRemaining(ticksToProcess - ticksProcessed);
        const id = setTimeout(processTick, 0); // Yield to the main thread
        setTimeoutId(id);
      } else {
        context.updateGameState();
        finish();
      }
    }

    processTick();
  }, []);

  return (
    <div>
      <h1>Processing Offline Progress...</h1>
      <div>
        Ticks Remaining:{" "}
        {ticksRemaining >= 0 ? ticksRemaining : "Calculating..."}
      </div>
      <button
        onClick={() => {
          finish();
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }}
      >
        Skip
      </button>
    </div>
  );
}
