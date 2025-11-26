import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";
import ExpeditionDisplay from "../ExpeditionDisplay";
import { useState } from "react";
import StartExpeditionMenu from "./StartExpeditionMenu";

export default function ExpeditionsMenu<
  TRegistryContext extends RegistryContext,
>({
  gameContext,
  registry,
}: {
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
}) {
  const [creatingExpedition, setCreatingExpedition] = useState(false);

  return (
    <div>
      <h1>Expeditions</h1>
      <button onClick={() => setCreatingExpedition(!creatingExpedition)}>
        {creatingExpedition ? "Cancel" : "Create Expedition"}
      </button>
      {creatingExpedition ? (
        <StartExpeditionMenu
          gameContext={gameContext}
          registry={registry}
          onStartExpedition={() => setCreatingExpedition(false)}
        />
      ) : (
        gameContext.expeditions.map((expedition, index) => (
          <ExpeditionDisplay
            key={index}
            expedition={expedition}
            gameContext={gameContext}
            registry={registry}
          />
        ))
      )}
    </div>
  );
}
