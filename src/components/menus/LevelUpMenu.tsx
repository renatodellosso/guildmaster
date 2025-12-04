import { AdventurerInstance } from "@/lib/creature";
import { getSkill } from "@/lib/creatureUtils";
import { SkillId } from "@/lib/skills";
import { useState } from "react";
import { Context } from "vm";

export function LevelUpMenu({
  adventurer,
  close,
}: {
  adventurer: AdventurerInstance;
  close: () => void;
  context: Context;
}) {
  const [skill, setSkill] = useState<SkillId>(SkillId.Melee);

  function levelUp() {
    adventurer.level += 1;

    // Increase selected skill by 1
    const currentSkillValue = getSkill(skill, adventurer);
    if (!adventurer.skills) {
      adventurer.skills = {};
    }
    adventurer.skills[skill] = currentSkillValue + 1;

    close();
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button onClick={close}>Back</button>
        <h2>
          Leveling {adventurer.name} up to level {adventurer.level + 1}
        </h2>
      </div>
      <div className="flex gap-2">
        <p>Select a skill to increase by 1:</p>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value as SkillId)}
        >
          {Object.keys(SkillId).map((skill) => (
            <option key={skill} value={skill}>
              {skill} ({getSkill(skill as SkillId, adventurer)} &rarr;{" "}
              {getSkill(skill as SkillId, adventurer) + 1})
            </option>
          ))}
        </select>
      </div>
      <button onClick={levelUp}>Confirm</button>
    </div>
  );
}
