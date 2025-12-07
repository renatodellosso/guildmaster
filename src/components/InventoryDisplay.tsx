import { items } from "@/lib/content/items";
import { formatInt, formatPercent } from "@/lib/format";
import { Inventory, sellFromInventory } from "@/lib/inventory";
import { Context } from "@/lib/utilTypes";
import ItemTooltip from "./ItemTooltip";
import { getSellValueMultiplier } from "@/lib/gameUtils";

export default function InventoryDisplay({
  inventory,
  context,
  canSell,
}: {
  inventory: Inventory;
  context: Context;
  canSell?: boolean;
}) {
  function sell(itemIndex: number) {
    const itemInstance = inventory[itemIndex];
    const def = items[itemInstance.definitionId];

    const sellValueMultiplier = getSellValueMultiplier(context.game);
    const res = prompt(
      `How many ${def.name} would you like to sell? (You have ${itemInstance.amount}) 
        (Value: ${formatInt(def.value * sellValueMultiplier)} = ${formatInt(def.value)} * ${formatPercent(sellValueMultiplier)} each)`,
      itemInstance.amount.toString()
    );

    if (res === null) {
      return;
    }

    const amountToSell = parseInt(res);
    if (
      isNaN(amountToSell) ||
      amountToSell <= 0 ||
      amountToSell > itemInstance.amount
    ) {
      alert("Invalid amount.");
      return;
    }

    const totalValue = sellFromInventory(
      { ...itemInstance, amount: amountToSell },
      inventory,
      context.game
    );

    alert(
      `You sold ${amountToSell} ${def.name} for ${formatInt(totalValue)} coins.`
    );
  }

  return (
    <div>
      <table>
        <thead className="border-b">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Value</th>
            {canSell && <th></th>}
          </tr>
        </thead>
        <tbody>
          {inventory.map((instance, index) => {
            const item = items[instance.definitionId];
            return (
              <tr key={index}>
                <td>
                  <ItemTooltip itemInstance={instance} context={context}>
                    {item.name}
                  </ItemTooltip>
                </td>
                <td className="text-right">{formatInt(instance.amount)}</td>
                <td className="text-right">
                  {formatInt(item.value * instance.amount)} (
                  {formatInt(item.value)} each)
                </td>
                {canSell && (
                  <td>
                    <button onClick={() => sell(index)}>Sell</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {inventory.length === 0 && <div>No items.</div>}
    </div>
  );
}
