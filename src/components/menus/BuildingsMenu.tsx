import { canReassignAdventurer } from "@/lib/activity";
import {
  canBuild,
  getConstructionProgressPerTickForWorker,
  startBuildingConstruction,
} from "@/lib/building";
import { BuildingId, buildings } from "@/lib/content/buildings";
import { items } from "@/lib/content/items";
import { getSkill } from "@/lib/creatureUtils";
import { hasInInventory } from "@/lib/inventory";
import { SkillId } from "@/lib/skills";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function BuildingsMenu({ context }: { context: Context }) {
  function startConstruction(buildingId: BuildingId) {
    startBuildingConstruction(buildingId, context.game);
    context.updateGameState();
  }

  const availableWorkers = Object.values(context.game.roster).filter(
    (adventurer) => canReassignAdventurer(adventurer, context.game)
  );

  const availableBuildings = Object.values(buildings).filter((buildingDef) =>
    canBuild(buildingDef.id, context.game)
  );

  return (
    <div>
      <h1>Stronghold</h1>
      <div>
        <h2>Buildings</h2>
        {Object.values(context.game.buildings).map((building) => (
          <div key={building.definitionId}>
            <strong>{buildings[building.definitionId].name}</strong> -{" "}
            {getFromOptionalFunc(
              buildings[building.definitionId].description,
              building,
              context.game
            )}
          </div>
        ))}
      </div>
      {Object.entries(context.game.buildingsUnderConstruction).length > 0 && (
        <div>
          <h2>Under Construction</h2>
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Work Remaining</th>
                <th>Workers</th>
                <th>Progress/Tick</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(context.game.buildingsUnderConstruction).map(
                ([buildingId, timeRemaining]) => {
                  const def = buildings[buildingId as BuildingId];
                  const workers = availableWorkers.filter(
                    (adventurer) =>
                      adventurer.activity.definitionId === "building" &&
                      adventurer.activity.data === buildingId
                  );

                  return (
                    <tr key={buildingId}>
                      <td>{def.name}</td>
                      <td className="text-right">
                        {timeRemaining}/{def.buildTime}
                      </td>
                      <td>
                        <div className="flex flex-col max-h-48 overflow-y-scroll pr-2">
                          {availableWorkers.length === 0 ? (
                            <div>None</div>
                          ) : (
                            availableWorkers.map((worker) => (
                              <span
                                key={String(worker.id)}
                                className="flex gap-1"
                              >
                                <input
                                  type="checkbox"
                                  checked={workers.includes(worker)}
                                  onChange={() => {
                                    if (workers.includes(worker)) {
                                      worker.activity = {
                                        definitionId: "resting",
                                      };
                                    } else {
                                      worker.activity = {
                                        definitionId: "building",
                                        data: buildingId,
                                      };
                                    }

                                    context.updateGameState();
                                  }}
                                />
                                <label>
                                  {worker.name} (
                                  {getSkill(
                                    SkillId.Construction,
                                    worker,
                                    context.game
                                  )}{" "}
                                  construction)
                                </label>
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="text-right">
                        {workers.reduce((total, worker) => {
                          return (
                            total +
                            getConstructionProgressPerTickForWorker(
                              worker,
                              context.game
                            )
                          );
                        }, 0)}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <h2>Available Buildings</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Work to Build</th>
              <th>Replaces</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {availableBuildings.length === 0 ? (
              <tr>
                <td colSpan={6}>No buildings available.</td>
              </tr>
            ) : (
              availableBuildings.map((buildingDef) => (
                <tr key={buildingDef.id}>
                  <td>{buildingDef.name}</td>
                  <td>
                    {getFromOptionalFunc(
                      buildingDef.description,
                      undefined,
                      context.game
                    )}
                  </td>
                  <td
                    className={
                      hasInInventory(context.game.inventory, buildingDef.cost)
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {buildingDef.cost
                      .map(
                        (cost) =>
                          `${cost.amount}x ${items[cost.definitionId].name}`
                      )
                      .join(", ")}
                  </td>
                  <td>{buildingDef.buildTime}</td>
                  <td>
                    {buildingDef.replaces
                      ? buildings[buildingDef.replaces].name
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      disabled={
                        !canBuild(buildingDef.id, context.game) ||
                        !hasInInventory(
                          context.game.inventory,
                          buildingDef.cost
                        )
                      }
                      onClick={() => {
                        startConstruction(buildingDef.id);
                      }}
                    >
                      Build
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
