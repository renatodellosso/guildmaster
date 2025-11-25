import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";
import ExpeditionDisplay from "../ExpeditionDisplay";

export default function CombatMenu<TRegistryContext extends RegistryContext>({
  gameContext,
  registry,
}: {
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
}) {
  return (
    <div>
      <h1>Combat Menu</h1>
      {gameContext.expeditions.map((expedition, index) => (
        <ExpeditionDisplay
          key={index}
          expedition={expedition}
          gameContext={gameContext}
          registry={registry}
        />
      ))}
    </div>
  );
}
