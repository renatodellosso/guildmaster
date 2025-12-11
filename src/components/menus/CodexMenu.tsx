import { Context } from "@/lib/utilTypes";
import { ComponentType, useState } from "react";
import CreaturesCodex from "../codex/CreaturesCodex";

enum TabId {
  Creatures = "Creatures",
}

export default function CodexMenu({ context }: { context: Context }) {
  const [tab, setTab] = useState<TabId>(TabId.Creatures);

  const tabMenus: {
    [key in TabId]: ComponentType<{ context: Context }>;
  } = {
    Creatures: CreaturesCodex,
  };

  const TabComponent = tabMenus[tab];

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
      <TabComponent context={context} />
    </div>
  );
}
