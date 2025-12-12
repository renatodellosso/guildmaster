import { ItemId, items } from "@/lib/content/items";
import { formatInt, formatPercent } from "@/lib/format";
import { Inventory, sellFromInventory } from "@/lib/inventory";
import { Context } from "@/lib/utilTypes";
import ItemTooltip from "./ItemTooltip";
import { getSellValueMultiplier } from "@/lib/gameUtils";
import { ItemInstance } from "@/lib/item";

export default function InventoryDisplay({
  inventory,
  context,
  canSell,
  allowAutoSell,
}: {
  inventory: Inventory;
  context: Context;
  canSell?: boolean;
  allowAutoSell?: boolean;
}) {
  if (!context.game.buildings.market_stall) {
    allowAutoSell = false;
  }

  function sell(itemIndex: number) {
    const itemInstance = inventory[itemIndex];
    const def = items[itemInstance.definitionId];

    const sellValueMultiplier = getSellValueMultiplier(context.game);
    const totalValuePerItem = def.value * sellValueMultiplier;
    const res = prompt(
      `How many ${def.name} would you like to sell? (You have ${itemInstance.amount}, worth ${formatInt(totalValuePerItem * itemInstance.amount)}) ` +
        `(Individual Value: ${formatInt(totalValuePerItem)} = ${formatInt(def.value)} * ${formatPercent(sellValueMultiplier)} each)`,
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

  function isItemMarkedForAutoSell(itemInstance: ItemInstance): boolean {
    if (!context.game.buildings.market_stall) {
      return false;
    }

    if (!("autoSellItems" in context.game.buildings.market_stall)) {
      return false;
    }

    const autoSellItems = context.game.buildings.market_stall
      .autoSellItems as ItemId[];
    return autoSellItems.includes(itemInstance.definitionId);
  }

  const stall = context.game.buildings.market_stall as {
    autoSellItems?: ItemId[];
  };

  function toggleItemAutoSell(itemInstance: ItemInstance) {
    if (!context.game.buildings.market_stall) {
      return;
    }

    if (!("autoSellItems" in context.game.buildings.market_stall)) {
      stall.autoSellItems = [];
    }

    const autoSellItems = stall.autoSellItems as ItemId[];
    const index = autoSellItems.indexOf(itemInstance.definitionId);
    if (index >= 0) {
      autoSellItems.splice(index, 1);
    } else {
      autoSellItems.push(itemInstance.definitionId);
    }

    context.updateGameState();
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
            {allowAutoSell && <th>Autosell</th>}
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
                {canSell && instance.definitionId !== "coin" && (
                  <td>
                    <button onClick={() => sell(index)}>Sell</button>
                  </td>
                )}
                {allowAutoSell && instance.definitionId !== "coin" && (
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={isItemMarkedForAutoSell(instance)}
                      onChange={() => {
                        toggleItemAutoSell(instance);
                      }}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {inventory.length === 0 && <div>No items.</div>}
      {allowAutoSell &&
        stall.autoSellItems &&
        stall.autoSellItems.length > 0 && (
          <div className="mt-4">
            <h2>Auto-selling:</h2>
            <table>
              <thead className="border-b">
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stall.autoSellItems.map((itemId) => {
                  const item = items[itemId];
                  return (
                    <tr key={itemId}>
                      <td>{item.name}</td>
                      <td className="text-right">{formatInt(item.value)}</td>
                      <td>
                        <button
                          onClick={() => {
                            toggleItemAutoSell({
                              definitionId: itemId,
                              amount: 0,
                            });
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
