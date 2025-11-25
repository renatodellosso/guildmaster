import { useEffect, useState } from "react";
import {
  MainGameContext,
  MainRegistryContext,
} from "../content/mainRegistryContext";
import { getDefaultSave, loadSave } from "../saveUtils";

export default function useSave() {
  const [gameContext, setGameContext] = useState<MainGameContext>();

  useEffect(() => {
    const save = loadSave<MainRegistryContext>();
    if (save) {
      setGameContext(save.gameContext);
    } else {
      setGameContext(getDefaultSave().gameContext);
    }
  }, [setGameContext]);

  return gameContext;
}
