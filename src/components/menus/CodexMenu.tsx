import { Context, Id } from "@/lib/utilTypes";
import { ReactNode, useState } from "react";
import { Registry } from "@/lib/registry";
import CreatureDetails from "../CreatureDetails";
import { createCreatureInstance } from "@/lib/creature";
import { creatures } from "@/lib/content/creatures";
import { classes, ClassId } from "@/lib/content/classes";
import ClassDetails from "../ClassDetails";
import { ErrorBoundary } from "react-error-boundary";
import DungeonDetails from "../DungeonDetails";
import { dungeons } from "@/lib/content/dungeons";

enum TabId {
  Creatures = "Creatures",
  Classes = "Classes",
  Dungeons = "Dungeons",
}

export default function CodexMenu({ context }: { context: Context }) {
  const [tab, setTab] = useState<TabId>(TabId.Creatures);

  const tabMenus: {
    [key in TabId]: ReactNode;
  } = {
    Creatures: (
      <CodexTab
        key="creatures"
        registry={creatures}
        getName={(_id, entry) => entry.name}
        render={(id) => (
          <CreatureDetails
            creature={createCreatureInstance(id, context.game)}
            context={context}
          />
        )}
      />
    ),
    Classes: (
      <CodexTab
        key="classes"
        registry={classes}
        getName={(_id, entry) => entry.name}
        render={(id) => <ClassEntry classId={id} context={context} />}
      />
    ),
    Dungeons: (
      <CodexTab
        key="dungeons"
        registry={dungeons}
        getName={(_id, entry) => entry.name}
        render={(id) => <DungeonDetails dungeonId={id} context={context} />}
      />
    ),
  };

  return (
    <div>
      <h1>Codex</h1>
      <div className="flex w-full">
        {Object.keys(TabId).map((tabId) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId as TabId)}
            className={`grow ${tab === tabId ? "underline" : ""}`}
          >
            {tabId}
          </button>
        ))}
      </div>
      {tabMenus[tab]}
    </div>
  );
}

function CodexTab<TId extends Id, TEntry>({
  registry,
  getName,
  render,
}: {
  registry: Registry<TId, TEntry>;
  getName: (id: TId, entry: TEntry) => string;
  render: (id: TId, entry: TEntry) => ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<TId>();

  return (
    <div className="flex">
      <div className="flex flex-col">
        {Object.entries(registry).map(([id, entry]) => (
          <button
            key={id}
            onClick={() => setSelectedId(id as TId)}
            className={`text-left ${selectedId === id ? "underline" : ""}`}
          >
            {getName(id as TId, entry as TEntry)}
          </button>
        ))}
      </div>
      {!selectedId ? (
        <div className="grow flex justify-center items-center">
          <p>Select an entry to view details</p>
        </div>
      ) : (
        <div className="m-2">
          <ErrorBoundary
            fallback={
              <span className="text-red-500">Error rendering codex entry.</span>
            }
          >
            {render(selectedId, registry[selectedId]!)}
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

function ClassEntry({
  classId,
  context,
}: {
  classId: ClassId;
  context: Context;
}) {
  const [level, setLevel] = useState<number>(1);

  return (
    <div className="flex flex-col">
      <label>
        Viewing Level:{" "}
        <input
          type="number"
          min={1}
          value={level}
          onChange={(e) => setLevel(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16"
        />
      </label>
      <ClassDetails
        classId={classId}
        context={context}
        level={level}
        creature={createCreatureInstance("human", context.game)}
      />
    </div>
  );
}
