import { tick } from "@/lib/tick";
import { Context } from "@/lib/utilTypes";
import { useCallback, useEffect, useState } from "react";

export function OfflineProgressWindow({
  context,
  finish,
}: {
  context: Context;
  finish: () => void;
}) {
  const [ticksRemaining, setTicksRemaining] = useState<number>(-1);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [startedProcessing, setStartedProcessing] = useState(false);

  const processOfflineProgress = useCallback(() => {
    if (startedProcessing) return;
    setStartedProcessing(true);

    const now = Date.now();
    const deltaSeconds = (now - context.game.lastTick) / 1000;
    const ticksToProcess = Math.floor(deltaSeconds);

    setTicksRemaining(ticksToProcess);

    const blockSize = 1000; // Number of ticks to process per render
    let ticksProcessed = 0;

    function processBlock() {
      for (let i = 0; i < blockSize && ticksProcessed < ticksToProcess; i++) {
        tick(context.game);
        ticksProcessed++;
      }
      setTicksRemaining(ticksToProcess - ticksProcessed);
      if (ticksProcessed < ticksToProcess) {
        const id = setTimeout(processBlock, 0); // Yield to the main thread
        setTimeoutId(id);
      } else {
        context.updateGameState();
        finish();
      }
    }

    processBlock();
  }, [startedProcessing, context, finish]);

  useEffect(() => {
    processOfflineProgress();
  }, [processOfflineProgress]);

  const hoursRemaining = Math.floor(ticksRemaining / 3600);
  const minutesRemaining = Math.floor((ticksRemaining % 3600) / 60);
  const secondsRemaining = ticksRemaining % 60;

  return (
    <div>
      <h1>Processing Offline Progress...</h1>
      <div>
        Ticks Remaining:{" "}
        {ticksRemaining >= 0
          ? `${ticksRemaining} (${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s)`
          : "Calculating..."}
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
