import { useEffect, useState } from "react";
import ExpeditionsMenu from "./components/menus/ExpeditionsMenu";
import {
  MainGameContext,
  mainRegistry,
  MainRegistryContext,
} from "@/lib/content/mainRegistryContext";
import useTick from "@/lib/hooks/useTick";
import { clearSave, getDefaultSave, loadSave } from "@/lib/saveUtils";
import RosterMenu from "./components/menus/RosterMenu";
import { Context } from "@/lib/utilTypes";

function App() {
  const [gameContext, setGameContext] = useState<MainGameContext>();

  const context: Context = {
    game: gameContext!,
    updateGameState: () => setGameContext({ ...gameContext! }),
    registry: mainRegistry,
  };

  useEffect(() => {
    const save = loadSave<MainRegistryContext>();
    if (save) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGameContext(save.gameContext);
    } else {
      setGameContext(getDefaultSave().gameContext);
    }
  }, []);

  const { lastSaveAt, lastDelta } = useTick(
    gameContext!,
    setGameContext,
    mainRegistry,
  );

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
    </div>
  );
}

export default App;
