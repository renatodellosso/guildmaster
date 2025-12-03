import { describe, expect, expectTypeOf, it } from "vitest";
import {
  finishRegistry,
  RegistryContext,
  RegistryToCreatureId,
} from "@/lib/registry";
import { CreatureDefinition } from "@/lib/creature";
import { Id } from "@/lib/utilTypes";

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

    expectTypeOf<
      MyRegistryContext["creatures"]["goblin"]["id"]
    >().toEqualTypeOf<"goblin">();
    expectTypeOf<
      MyRegistryContext["creatures"]["orc"]["id"]
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

describe("RegistryToCreatureId", () => {
  it("extracts the creature ID type from a RegistryContext", () => {
    type MyRegistryContext = Omit<RegistryContext, "creatures"> & {
      creatures: {
        goblin: CreatureDefinition;
        orc: CreatureDefinition;
      };
    };

    type CreatureId = RegistryToCreatureId<MyRegistryContext>;

    expectTypeOf<CreatureId>().toEqualTypeOf<"goblin" | "orc">();
  });

  it("extends Id", () => {
    type MyRegistryContext = Omit<RegistryContext, "creatures"> & {
      creatures: {
        goblin: CreatureDefinition;
        orc: CreatureDefinition;
      };
    };

    type CreatureId = RegistryToCreatureId<MyRegistryContext>;

    expectTypeOf<CreatureId>().toExtend<Id>();
  });
});
