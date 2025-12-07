import { activities } from "@/lib/content/activities";
import { AdventurerInstance } from "@/lib/creature";
import {
  getXpForNextLevel,
  getMaxHealth,
  getSkill,
  getResistances,
  getMaxMana,
  getHealthRegen,
  getManaRegen,
  getActionsPerTurn,
  getXpMultiplier,
  getConstructionPerTick,
} from "@/lib/creatureUtils";
import { formatBonus, formatInt, formatPercent, titleCase } from "@/lib/format";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import { useEffect, useState } from "react";
import { LevelUpMenu } from "./menus/LevelUpMenu";
import { SkillId } from "@/lib/skills";
import { EquipmentDefinition, isEquipment } from "@/lib/item";
import { items } from "@/lib/content/items";
import { addToInventory, removeFromInventory } from "@/lib/inventory";
import ItemTooltip from "./ItemTooltip";
import { getAbilities } from "@/lib/ability";
import AbilityDescription from "./AbilityDescription";
import StatusEffectDisplay from "./StatusEffectDisplay";
import { classes, ClassId } from "@/lib/content/classes";
import ClassTooltip from "./ClassTooltip";
import { canReassignAdventurer } from "@/lib/activity";
import { EquipmentSlot } from "@/lib/equipmentSlot";
import { Tooltip } from "./Tooltip";

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

  const abilities = getAbilities(adventurer, undefined, context.game);
  const resistances = getResistances(adventurer, context.game);

  function expelFromGuild() {
    if (
      !canReassignAdventurer(adventurer, context.game) ||
      Object.values(context.game.roster).length <= 1 ||
      !confirm(`Are you sure you want to expel ${adventurer.name}?`)
    ) {
      return;
    }

    delete context.game.roster[adventurer.id];
    context.updateGameState();
  }

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
      {canReassignAdventurer(adventurer, context.game) &&
        Object.values(context.game.roster).length > 1 && (
          <button onClick={expelFromGuild} className="bg-red-900">
            Expel from guild
          </button>
        )}
      <div>
        HP: {formatInt(adventurer.hp)}/
        {formatInt(getMaxHealth(adventurer, context.game))}{" "}
        <Tooltip content="3x as much while resting, 0x during expeditions.">
          ({formatBonus(getHealthRegen(adventurer, context.game))}/tick base
          (?))
        </Tooltip>
      </div>
      <div>
        Mana: {formatInt(adventurer.mana)}/
        {formatInt(getMaxMana(adventurer, context.game))} (
        {formatBonus(getManaRegen(adventurer, context.game))}/tick base)
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
        Actions Per Turn:{" "}
        {formatInt(getActionsPerTurn(adventurer, context.game))}
      </div>
      <div>
        XP Multiplier:{" "}
        {formatPercent(getXpMultiplier(adventurer, context.game))}
      </div>
      <div>
        Construction Per Tick:{" "}
        {formatInt(getConstructionPerTick(adventurer, context.game))}
      </div>
      <div>
        <strong>Skills:</strong>
        <ul>
          {Object.values(SkillId).map((skillId) => (
            <li key={skillId}>
              {skillId}:{" "}
              {formatInt(getSkill(skillId, adventurer, context.game))}
            </li>
          ))}
        </ul>
      </div>
      {resistances && Object.entries(resistances).length > 0 && (
        <div>
          <strong>Resistances:</strong>
          {Object.entries(resistances).map(([resistanceType, value]) => (
            <div key={resistanceType}>
              {titleCase(resistanceType)}: {formatPercent(value)}
            </div>
          ))}
        </div>
      )}
      {adventurer.statusEffects && adventurer.statusEffects.length > 0 && (
        <div className="flex flex-col">
          <strong>Status Effects:</strong>
          {adventurer.statusEffects.map((statusEffect, index) => (
            <StatusEffectDisplay
              key={index}
              instance={statusEffect}
              creature={adventurer}
              context={context}
            />
          ))}
        </div>
      )}
      <div className="w-1/8">
        <strong>Equipment:</strong>
        <table>
          <tbody>
            {Object.values(EquipmentSlot).map((slot) => (
              <EquipmentSelect
                adventurer={adventurer}
                slot={slot}
                context={context}
                /* Key needs to include adventurer ID so it always rerenders */
                key={`equipment-select-${slot}-${String(adventurer.id)}`}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <strong>Abilities:</strong>
        {abilities.length === 0 && <p>No abilities.</p>}
        {abilities.map((ability, index) => (
          <AbilityDescription ability={ability} key={index} />
        ))}
      </div>
    </>
  );

  const classList = (
    <span>
      (
      {Object.entries(adventurer.classes)
        .map(([classId, level]) => (
          <ClassTooltip
            key={classId}
            classId={classId as ClassId}
            creature={adventurer}
            context={context}
            level={level}
          >
            {classes[classId as ClassId].name} {level}
          </ClassTooltip>
        ))
        .reduce(
          (prev, curr, index) => (
            <>
              {prev}
              {index > 0 ? ", " : ""}
              {curr}
            </>
          ),
          <></>
        )}
      )
    </span>
  );

  return (
    <div className="p-2 border grow">
      <h2>{adventurer.name}</h2>
      {Object.keys(adventurer.classes).length > 0 && classList}
      {body}
    </div>
  );
}

function EquipmentSelect({
  adventurer,
  slot,
  context,
}: {
  adventurer: AdventurerInstance;
  slot: EquipmentSlot;
  context: Context;
}) {
  const availableEquipment = context.game.inventory
    .filter(isEquipment)
    .filter((item) => {
      const def = items[item.definitionId] as EquipmentDefinition;
      return def.slot === slot;
    });

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (value === "none") {
      if (slot in adventurer.equipment && adventurer.equipment[slot]) {
        addToInventory(context.game.inventory, {
          ...adventurer.equipment[slot]!,
          amount: 1,
        });
        delete adventurer.equipment[slot];

        context.updateGameState();
      }
      return;
    }

    const index = parseInt(value);
    if (index === -1) {
      return;
    }

    if (slot in adventurer.equipment && adventurer.equipment[slot]) {
      addToInventory(context.game.inventory, {
        ...adventurer.equipment[slot]!,
        amount: 1,
      });
    }

    adventurer.equipment[slot] = {
      ...availableEquipment[index],
      amount: 1,
    };

    removeFromInventory(context.game.inventory, {
      ...availableEquipment[index],
      amount: 1,
    });

    context.updateGameState();
  }

  return (
    <tr>
      <td>{titleCase(slot)}:</td>
      <td>
        <ItemTooltip
          itemInstance={adventurer.equipment[slot]}
          context={context}
        >
          <select
            onChange={handleChange}
            defaultValue={adventurer.equipment[slot] ? -1 : undefined}
            className="min-w-full"
          >
            <option value={"none"}>None</option>
            {slot in adventurer.equipment && adventurer.equipment[slot] && (
              <option value={-1}>
                {
                  (
                    items[
                      adventurer.equipment[slot].definitionId
                    ] as EquipmentDefinition
                  )?.name
                }{" "}
                (equipped)
              </option>
            )}
            {availableEquipment.map((item, index) => {
              const def = items[item.definitionId] as EquipmentDefinition;
              return (
                <option value={index} key={index}>
                  {def.name}
                </option>
              );
            })}
          </select>
        </ItemTooltip>
      </td>
    </tr>
  );
}
