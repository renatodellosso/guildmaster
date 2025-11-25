import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";
import CombatDisplay from "../CombatDisplay";

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
      {
        gameContext.combats.map((combat, index) => (
          <CombatDisplay key={index} combat={combat} gameContext={gameContext} registry={registry} />
        ))
      }
    </div>
  );
}
