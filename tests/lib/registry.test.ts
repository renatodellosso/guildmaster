import { describe, expect, it } from "vitest";
import { finishRegistry } from "@/lib/registry";

describe(finishRegistry.name, () => {
  it("adds IDs to each item in the registry", () => {
    const rawRegistry = {
      goblin: { name: "Goblin" },
      orc: { name: "Orc" },
    };

    const finishedRegistry = finishRegistry(rawRegistry);

    expect(finishedRegistry).toEqual({
      goblin: { id: "goblin", name: "Goblin" },
      orc: { id: "orc", name: "Orc" },
    });
  });
});
