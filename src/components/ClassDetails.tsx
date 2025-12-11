import { classes, ClassId } from "@/lib/content/classes";
import { CreatureInstance } from "@/lib/creature";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import CreatureProviderDetails from "./CreatureProviderDetails";

export default function ClassDetails({
  classId,
  creature,
  level,
  context,
}: {
  classId: ClassId;
  creature: CreatureInstance;
  context: Context;
  level: number;
}) {
  const cls = classes[classId];

  return (
    <>
      <strong>
        {cls.name} {level}
      </strong>
      <p>
        {getFromOptionalFunc(cls.description, creature, context.game, level)}
      </p>
      <em>{cls.canSelectText}</em>
      <CreatureProviderDetails
        provider={cls}
        source={level}
        creature={creature}
        context={context}
      />
    </>
  );
}
