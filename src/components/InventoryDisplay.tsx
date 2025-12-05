import { items } from "@/lib/content/items";
import { formatInt } from "@/lib/format";
import { Inventory } from "@/lib/inventory";
import { Context } from "@/lib/utilTypes";

export default function InventoryDisplay({
  inventory,
}: {
  inventory: Inventory;
  context: Context;
}) {
  return (
    <div>
      <table>
        <thead className="border-b">
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((instance, index) => {
            const item = items[instance.definitionId];
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td className="text-right">{formatInt(instance.amount)}</td>
                <td className="text-right">
                  {formatInt(item.value * instance.amount)} (
                  {formatInt(item.value)} each)
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {inventory.length === 0 && <div>No items.</div>}
    </div>
  );
}
