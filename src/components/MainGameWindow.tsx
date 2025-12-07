import useTick from "@/lib/hooks/useTick";
import { Context } from "@/lib/utilTypes";
import InventoryDisplay from "./InventoryDisplay";
import ExpeditionsMenu from "./menus/ExpeditionsMenu";
import RosterMenu from "./menus/RosterMenu";
import { GameContext } from "@/lib/gameContext";
import BuildingsMenu from "./menus/BuildingsMenu";
import { ComponentType, useState } from "react";
import OptionsMenu from "./menus/OptionsMenu";

enum MenuId {
  Expeditions = "Expeditions",
  Roster = "Roster",
  Buildings = "Buildings",
  Inventory = "Inventory",
  Options = "Options",
}

export default function MainGameWindow({
  context,
  setGameContext,
}: {
  context: Context;
  setGameContext: (gameContext: GameContext) => void;
}) {
  const { lastSaveAt, lastDelta } = useTick(context.game!, setGameContext);

  const menus: {
    [key in MenuId]: ComponentType<{ context: Context }>;
  } = {
    Expeditions: ExpeditionsMenu,
    Roster: RosterMenu,
    Buildings: BuildingsMenu,
    Inventory: ({ context }: { context: Context }) => (
      <div>
        <h1>Inventory</h1>
        <InventoryDisplay
          inventory={context.game.inventory}
          context={context}
          canSell={true}
        />
      </div>
    ),
    Options: ({ context }: { context: Context }) => (
      <OptionsMenu
        context={context}
        lastSaveAt={lastSaveAt}
        lastDelta={lastDelta}
      />
    ),
  };

  const [menu, setMenu] = useState<MenuId>(MenuId.Expeditions);

  const MenuComponent = menus[menu];

  return (
    <div>
      <div className="flex w-full">
        {Object.keys(menus).map((menuId) => (
          <button
            key={menuId}
            onClick={() => setMenu(menuId as MenuId)}
            className={`${menu === menuId ? "underline" : ""} grow`}
          >
            {menuId}
          </button>
        ))}
      </div>
      <MenuComponent context={context} />
    </div>
  );
}
