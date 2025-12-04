import { GameContext } from "./gameContext";

const SAVE_KEY = "guildmaster_save";

type Save = {
  gameContext: GameContext;
  savedAt: number;
};

export function saveGame(gameContext: GameContext) {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      gameContext,
      savedAt: Date.now(),
    })
  );
}

export function loadSave(): Save {
  const savedData = localStorage.getItem(SAVE_KEY);
  if (!savedData) {
    return getDefaultSave();
  }

  return JSON.parse(savedData);
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function getDefaultSave(): Save {
  return {
    savedAt: Date.now(),
    gameContext: {
      lastTick: Date.now(),
      roster: {
        "creature-1": {
          id: "creature-1",
          definitionId: "human",
          name: "Test",
          activity: {
            definitionId: "resting",
          },
          hp: 10,
        },
      },
      expeditions: [],
    },
  };
}
