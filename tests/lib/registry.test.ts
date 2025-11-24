import { describe, expect, expectTypeOf, it } from "vitest";
import { finishRegistry } from "@/lib/registry";

describe("RegistryContext", () => {
  it("can be instantiated with specific creature IDs", () => {
    type MyRegistryContext = {
      creatures: {
        goblin: {
          id: "goblin";
          name: string;
        };
        orc: {
          id: "orc";
          name: string;
        };
      };
    };

    const registryContext: MyRegistryContext = {
      creatures: {
        goblin: { id: "goblin", name: "Goblin" },
        orc: { id: "orc", name: "Orc" },
      },
    };

    expectTypeOf<
      typeof registryContext.creatures.goblin.id
    >().toEqualTypeOf<"goblin">();
    expectTypeOf<
      typeof registryContext.creatures.orc.id
    >().toEqualTypeOf<"orc">();

    expectTypeOf<"goblin" | "orc">().toExtend<
      keyof MyRegistryContext["creatures"]
    >();
  });

  it("prevents invalid creature IDs", () => {
    type MyRegistryContext = {
      creatures: {
        goblin: {
          id: "goblin";
          name: string;
        };
        orc: {
          id: "orc";
          name: string;
        };
      };
    };

    expectTypeOf<{
      creatures: {
        troll: {
          id: "troll";
          name: string;
        };
      };
    }>().not.toExtend<MyRegistryContext>();

    expectTypeOf<"troll">().not.toEqualTypeOf<
      keyof MyRegistryContext["creatures"]
    >();
  });
});

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
