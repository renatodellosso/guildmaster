import { createCreatureInstance } from "./creature";
import { randomName } from "./creatureUtils";
import { GameContext } from "./gameContext";
import { getMaxRosterSize } from "./gameUtils";

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
  const context: GameContext = {
    lastTick: Date.now(),
    roster: {},
    expeditions: [],
    inventory: [],
    buildings: {},
    buildingsUnderConstruction: {},
  };

  function addStartingAdventurer() {
    const creature = createCreatureInstance("human", context);
    creature.name = randomName();
    context.roster[creature.id] = {
      ...creature,
      xp: 0,
      level: 0,
      activity: {
        definitionId: "resting",
      },
      skills: {},
    };
  }

  while (Object.keys(context.roster).length < getMaxRosterSize(context)) {
    addStartingAdventurer();
  }

  return {
    gameContext: context,
    savedAt: Date.now(),
  };
}
