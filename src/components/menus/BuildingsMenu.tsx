import { canReassignAdventurer } from "@/lib/activity";
import { canBuild, startBuildingConstruction } from "@/lib/building";
import { BuildingId, buildings } from "@/lib/content/buildings";
import { getConstructionPerTick } from "@/lib/creatureUtils";
import { addToInventory, hasInInventory } from "@/lib/inventory";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import BuildingTooltip from "../BuildingTooltip";
import { formatDuration, formatInt } from "@/lib/format";
import ItemList from "../ItemList";
import { round } from "@/lib/utils";
import { Tooltip } from "../Tooltip";

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
      {Object.values(context.game.buildings).length > 0 && (
        <div>
          <h2>Buildings</h2>
          {Object.values(context.game.buildings).map((building) => (
            <div key={building.definitionId}>
              <BuildingTooltip building={building} context={context}>
                <strong>{buildings[building.definitionId].name}</strong> -{" "}
                {getFromOptionalFunc(
                  buildings[building.definitionId].description,
                  building,
                  context.game
                )}
              </BuildingTooltip>
            </div>
          ))}
        </div>
      )}
      {Object.entries(context.game.buildingsUnderConstruction).length > 0 && (
        <div>
          <h2>Under Construction</h2>
          <table>
            <thead>
              <tr>
                <th>Building</th>
                <th>Replacing</th>
                <th>Work Remaining</th>
                <th>
                  <Tooltip content="Each worker contributes 1 + Construction skill by default.">
                    Workers (work/tick) (?)
                  </Tooltip>
                </th>
                <th>Work/Tick</th>
                <th>Time Remaining</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {Object.entries(context.game.buildingsUnderConstruction).map(
                ([buildingId, workRemaining]) => {
                  const def = buildings[buildingId as BuildingId];
                  const workers = availableWorkers.filter(
                    (adventurer) =>
                      adventurer.activity.definitionId === "building" &&
                      adventurer.activity.data === buildingId
                  );

                  const workPerTick = workers.reduce((total, worker) => {
                    return total + getConstructionPerTick(worker, context.game);
                  }, 0);

                  return (
                    <tr key={buildingId}>
                      <td>
                        <BuildingTooltip
                          key={buildingId}
                          building={buildingId as BuildingId}
                          context={context}
                        >
                          {def.name}
                        </BuildingTooltip>
                      </td>
                      <td>
                        {def.replaces ? (
                          <BuildingTooltip
                            building={def.replaces}
                            context={context}
                          >
                            {buildings[def.replaces].name}
                          </BuildingTooltip>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="text-right">
                        {formatInt(workRemaining)}/{formatInt(def.buildTime)}
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
                                  id={`${buildingId}-${String(worker.id)}`}
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
                                <label
                                  htmlFor={`${buildingId}-${String(worker.id)}`}
                                >
                                  {worker.name} (
                                  {formatInt(
                                    getConstructionPerTick(worker, context.game)
                                  )}
                                  )
                                </label>
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="text-right">{formatInt(workPerTick)}</td>
                      <td className="text-right">
                        {formatDuration(round(workRemaining / workPerTick))}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (
                              !confirm(`Cancel construction of ${def.name}?`)
                            ) {
                              return;
                            }

                            // Remove all workers
                            workers.forEach((worker) => {
                              worker.activity = { definitionId: "resting" };
                            });

                            // Refund costs
                            addToInventory(context.game.inventory, def.cost);

                            // Remove construction
                            delete context.game.buildingsUnderConstruction[
                              buildingId as BuildingId
                            ];

                            context.updateGameState();
                          }}
                        >
                          Cancel
                        </button>
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
              <th>Cost</th>
              <th>Work to Build</th>
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
                  <td>
                    <BuildingTooltip
                      building={buildingDef.id}
                      context={context}
                    >
                      {buildingDef.name}
                    </BuildingTooltip>
                  </td>
                  <td>
                    {getFromOptionalFunc(
                      buildingDef.description,
                      undefined,
                      context.game
                    )}
                  </td>
                  <td>
                    <ItemList
                      items={buildingDef.cost}
                      context={context}
                      colorIfAvailable
                    />
                  </td>
                  <td className="text-right">
                    {formatInt(buildingDef.buildTime)}
                  </td>
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
