import { useEffect, useState } from "react";
import ExpeditionsMenu from "./components/menus/ExpeditionsMenu";
import { GameContext } from "@/lib/gameContext";
import useTick from "@/lib/hooks/useTick";
import { clearSave, getDefaultSave, loadSave } from "@/lib/saveUtils";
import RosterMenu from "./components/menus/RosterMenu";
import { Context } from "@/lib/utilTypes";
import InventoryDisplay from "./components/InventoryDisplay";

function App() {
  const [gameContext, setGameContext] = useState<GameContext>();

  const context: Context = {
    game: gameContext!,
    updateGameState: () => setGameContext({ ...gameContext! }),
  };

  useEffect(() => {
    const save = loadSave();
    if (save) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameContext(save.gameContext);
    } else {
      setGameContext(getDefaultSave().gameContext);
    }
  }, []);

  const { lastSaveAt, lastDelta } = useTick(gameContext!, setGameContext);

  if (!gameContext) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => {
          clearSave();
          location.reload();
        }}
      >
        Clear Save
      </button>
      <div>
        Last Tick:{" "}
        {gameContext
          ? new Date(gameContext.lastTick).toLocaleTimeString()
          : "N/A"}
      </div>
      <div>Last Delta: {lastDelta ? lastDelta.toFixed(3) + "s" : "N/A"}</div>
      <div>
        Last Save:{" "}
        {lastSaveAt ? new Date(lastSaveAt).toLocaleTimeString() : "N/A"}
      </div>
      <ExpeditionsMenu context={context} />
      <RosterMenu context={context} />
      <div>
        <h1>Inventory</h1>
        <InventoryDisplay inventory={gameContext.inventory} context={context} />
      </div>
    </div>
  );
}

export default App;
