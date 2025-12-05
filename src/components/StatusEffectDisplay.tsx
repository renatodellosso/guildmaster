import { statusEffects } from "@/lib/content/statusEffects";
import { CreatureInstance } from "@/lib/creature";
import { StatusEffectInstance } from "@/lib/statusEffect";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import { Tooltip } from "./Tooltip";

export default function StatusEffectDisplay({
  instance,
  creature,
  context,
}: {
  instance: StatusEffectInstance;
  creature: CreatureInstance | undefined;
  context: Context;
}) {
  const statusEffectDef = statusEffects[instance.definitionId];

  if (!statusEffectDef) {
    return <div>Unknown Status Effect</div>;
  }

  return (
    <Tooltip
      content={getFromOptionalFunc(
        statusEffectDef.description,
        creature,
        instance,
        context.game
      )}
    >
      {statusEffectDef.name} {instance.strength} (
      {instance.duration === "infinite" ? "∞" : instance.duration} turns)
    </Tooltip>
  );
}
