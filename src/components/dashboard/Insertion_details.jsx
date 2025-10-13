import React from 'react';

// Unused imports can be removed for cleaner code
// import { formatFsDate, toFixedOrDash } from '../../utils/formatters';
// import { calculatePacing, daysPassed, calculateDaysDiff } from '../../utils/pacingCalculations';

export default function InsertionDetailsTable({ rows }) {
  const headers = [
    // "Insertion Order",
    "Line Item",
    "Line Item ID",
    "Line Item Type",
    "Impression",
    "Completion Rate",
    "Views",
    "Status"
  ];
  
  return (
    <div className="overflow-x-auto shadow-md mt-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* ✅ This now correctly maps over the lineItems array */}
          {rows.map((lineItem) => {
            return (
              <tr key={lineItem.id} className="border-b hover:bg-gray-50">
                {/* ✅ Use the field names from your 'Line_Item_data' collection */}
                {/* <td className="px-4 py-2 text-sm text-gray-800 font-semibold">{lineItem.insertion_order ?? "-"}</td> */}
                <td className="px-4 py-2 text-sm text-gray-800 font-semibold">{lineItem.Line_item_name ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.Line_item_id ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.Line_item_type ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.impressions ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.completion_rate_video ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.complete_views_video ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{lineItem.Line_item_status === "Active" ? (
                  <div className="flex items-center">
      <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
      {/* <span>Active</span> */}
    </div>
                ):(
                  lineItem.Line_item_status ?? "-"
                )}</td>
                
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}