import { useState } from "react";
import CombatMenu from "./components/menus/CombatMenu";
import {
  MainGameContext,
  mainRegistry,
} from "@/lib/content/mainRegistryContext";
import useTick from "@/lib/hooks/useTick";

function App() {
  const [gameContext, setGameContext] = useState<MainGameContext>({
    lastTick: Date.now(),
    roster: {
      creature1: { id: "creature1", definitionId: "human", hp: 100 },
    },
    combats: [
      {
        allies: {
          creatures: ["creature1"],
          retreatTriggers: [],
          retreatTimer: -1,
        },
        enemies: {
          creatures: [
            {
              id: "creature2",
              definitionId: "human",
              hp: 100,
            },
          ],
          retreatTriggers: [],
          retreatTimer: -1,
        },
      },
    ],
  });

  useTick(gameContext!, setGameContext, mainRegistry);

  return (
    <div>
      <div>
        Last Tick:{" "}
        {gameContext
          ? new Date(gameContext.lastTick).toLocaleTimeString()
          : "N/A"}
      </div>
      <CombatMenu gameContext={gameContext} registry={mainRegistry} />
    </div>
  );
}

export default App;
