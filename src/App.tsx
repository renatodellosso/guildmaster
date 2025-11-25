import { useEffect, useState } from "react";
import CombatMenu from "./components/menus/CombatMenu";
import {
  MainGameContext,
  mainRegistry,
} from "@/lib/content/mainRegistryContext";
import useTick from "@/lib/hooks/useTick";
import useSave from "@/lib/hooks/useSave";
import { clearSave } from "@/lib/saveUtils";
import RosterMenu from "./components/menus/RosterMenu";

function App() {
  const save = useSave();

  const [gameContext, setGameContext] = useState<MainGameContext | undefined>(
    save
  );

  useEffect(() => {
    if (save) {
      setGameContext(save);
    }
  }, [save]);

  const { lastSaveAt, lastDelta } = useTick(
    gameContext!,
    setGameContext,
    mainRegistry
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
      <CombatMenu gameContext={gameContext} registry={mainRegistry} />
      <RosterMenu gameContext={gameContext} registry={mainRegistry} />
    </div>
  );
}

export default App;
