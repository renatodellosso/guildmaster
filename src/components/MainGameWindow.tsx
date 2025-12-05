import useTick from "@/lib/hooks/useTick";
import { clearSave } from "@/lib/saveUtils";
import { Context } from "@/lib/utilTypes";
import InventoryDisplay from "./InventoryDisplay";
import ExpeditionsMenu from "./menus/ExpeditionsMenu";
import RosterMenu from "./menus/RosterMenu";
import { GameContext } from "@/lib/gameContext";

export default function MainGameWindow({
  context,
  setGameContext,
}: {
  context: Context;
  setGameContext: (gameContext: GameContext) => void;
}) {
  const { lastSaveAt, lastDelta } = useTick(context.game!, setGameContext);

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
        {context.game.lastTick
          ? new Date(context.game.lastTick).toLocaleTimeString()
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
        <InventoryDisplay inventory={context.game.inventory} context={context} />
      </div>
    </div>
  );
}
