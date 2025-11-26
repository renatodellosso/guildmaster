import { MainRegistryContext } from "./content/mainRegistryContext";
import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";

const SAVE_KEY = "guildmaster_save";

type Save<TRegistryContext extends RegistryContext> = {
  gameContext: GameContext<TRegistryContext>;
  savedAt: number;
};

export function saveGame<TRegistryContext extends RegistryContext>(
  gameContext: GameContext<TRegistryContext>
) {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      gameContext,
      savedAt: Date.now(),
    })
  );
}

export function loadSave<
  TRegistryContext extends RegistryContext,
>(): Save<TRegistryContext> {
  const savedData = localStorage.getItem(SAVE_KEY);
  if (!savedData) {
    return getDefaultSave();
  }

  return JSON.parse(savedData);
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function getDefaultSave(): Save<MainRegistryContext> {
  return {
    savedAt: Date.now(),
    gameContext: {
      lastTick: Date.now(),
      roster: {
        "creature-1": { id: "creature-1", definitionId: "human", hp: 10 },
      },
      expeditions: [],
    },
  };
}
