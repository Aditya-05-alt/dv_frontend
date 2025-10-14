import { calculateToBeSpent } from "../../utils/tobespend";
// The component is now "dumb". It only receives data (rows) and a function to call (handleInputChange).
export default function BudgetSheetDetails({ rows, handleInputChange }) {
  const headers = [
    "Campaign",
    "Gross Budget $",
    "Net Budget",
    "Markup",
    "To Be Spent $",
  ];

  // We removed the local useState hook.

  return (
    <div className="overflow-x-auto shadow-md mt-4">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2 text-center text-sm font-medium text-gray-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Map over the 'rows' prop directly */}
          {rows.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-center text-gray-800">
                {item.campaign}
              </td>

              {/* Gross Budget Input */}
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm text-center border-b-2 text-gray-800"
                  placeholder="$0.00"
                  value={item.grossBudget || ""}
                  // **KEY CHANGE**: Call the handler from props, passing the unique ID.
                  onChange={(e) => handleInputChange(item.id, "grossBudget", e.target.value)}
                />
              </td>

              {/* Net Budget Input */}
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm text-center border-b-2 text-gray-800"
                  placeholder="0.00"
                  value={item.netBudget || ""}
                  onChange={(e) => handleInputChange(item.id, "netBudget", e.target.value)}
                />
              </td>

              {/* Markup Input */}
              <td className="px-4 py-2">
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm text-center border-b-2 text-gray-800" // Removed disabled styles
                  placeholder="$0.00"
                  value={item.markup || ""}
                  onChange={(e) => handleInputChange(item.id, "markup", e.target.value)} // Added onChange handler
                  // readOnly property has been removed
                />
              </td>
              
              <td className="px-4 py-2 text-center text-sm text-gray-800">
                {calculateToBeSpent(item.grossBudget, item.netBudget, item.markup)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}