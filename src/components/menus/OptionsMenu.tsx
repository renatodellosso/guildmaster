import { clearSave, saveGame } from "@/lib/saveUtils";
import { Context } from "@/lib/utilTypes";

export default function OptionsMenu({
  context,
  lastSaveAt,
  lastDelta,
}: {
  context: Context;
  lastSaveAt: number | undefined;
  lastDelta: number | undefined;
}) {
  return (
    <div className="flex flex-col w-1/8">
      <h1>Options</h1>
      <button
        onClick={() => {
          if (!confirm("Are you sure you want to delete your save?")) {
            return;
          }
          clearSave();
          location.reload();
        }}
        className="bg-red-800"
      >
        Delete Save
      </button>
      <button
        onClick={() => {
          saveGame(context.game!);
        }}
      >
        Save Game
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
    </div>
  );
}
