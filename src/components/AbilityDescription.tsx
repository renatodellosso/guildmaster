import { AbilityWithSource } from "@/lib/ability";

export default function AbilityDescription({
  ability: { ability },
}: {
  ability: AbilityWithSource;
}) {
  return (
    <div>
      <strong>{ability.name}</strong>
      <p>{ability.description}</p>
    </div>
  );
}
