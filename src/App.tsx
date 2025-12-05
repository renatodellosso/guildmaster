import { useEffect, useState } from "react";
import { GameContext } from "@/lib/gameContext";
import { getDefaultSave, loadSave } from "@/lib/saveUtils";
import { Context } from "@/lib/utilTypes";
import MainGameWindow from "./components/MainGameWindow";
import { OfflineProgressWindow } from "./components/OfflineProgressWindow";

function App() {
  const [gameContext, setGameContext] = useState<GameContext>();
  const [processingOfflineProgress, setProcessingOfflineProgress] =
    useState(true);

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

    setProcessingOfflineProgress(save.savedAt < Date.now() - 1000);
  }, []);

  if (!gameContext) {
    return <div>Loading...</div>;
  }

  if (processingOfflineProgress) {
    return (
      <OfflineProgressWindow
        context={context}
        finish={() => setProcessingOfflineProgress(false)}
      />
    );
  }

  return <MainGameWindow context={context} setGameContext={setGameContext} />;
}

export default App;
