import { activities } from "@/lib/content/activities";
import { AdventurerInstance } from "@/lib/creature";
import { getXpForNextLevel, getMaxHealth, getSkill } from "@/lib/creatureUtils";
import { formatInt } from "@/lib/format";
import { getFromOptionalFunc } from "@/lib/utilTypes";
import { useEffect, useState } from "react";
import { Context } from "vm";
import { LevelUpMenu } from "./menus/LevelUpMenu";
import { SkillId } from "@/lib/skills";

export function AdventurerDisplay({
  adventurer,
  context,
}: {
  adventurer: AdventurerInstance;
  context: Context;
}) {
  const [levelUpMenuOpen, setLevelUpMenuOpen] = useState(false);
  const xpForNextLevel = getXpForNextLevel(adventurer.level);

  useEffect(() => {
    setLevelUpMenuOpen(false);
  }, [adventurer.id]);

  const body = levelUpMenuOpen ? (
    <LevelUpMenu
      adventurer={adventurer}
      close={() => setLevelUpMenuOpen(false)}
      context={context}
    />
  ) : (
    <>
      <div
        className={
          adventurer.xp >= xpForNextLevel
            ? "font-bold text-green-600 flex gap-1"
            : ""
        }
      >
        <p>
          Level: {adventurer.level} | XP: {formatInt(adventurer.xp)}/
          {formatInt(xpForNextLevel)}
        </p>
        {adventurer.xp >= xpForNextLevel && (
          <button onClick={() => setLevelUpMenuOpen(true)}>Level Up</button>
        )}
      </div>
      <div>
        HP: {formatInt(adventurer.hp)}/
        {formatInt(getMaxHealth(adventurer, context.game))}
      </div>
      <div>
        Activity:{" "}
        {getFromOptionalFunc(
          activities[adventurer.activity.definitionId].description,
          adventurer,
          context.game
        )}
      </div>
      <div>
        Skills:
        <ul>
          {Object.values(SkillId).map((skillId) => (
            <li key={skillId}>
              {skillId}: {getSkill(skillId, adventurer)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <div className="p-2 border grow">
      <h2>{adventurer.name}</h2>
      {body}
    </div>
  );
}
