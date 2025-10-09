import React from "react";
import { formatFsDate, toFixedOrDash } from "../../utils/formatters";
import { Link } from "react-router-dom";

export default function DataTable_camp({ rows }) {
    // ADDED: New header for the media cost column
    const headers = [,"Campaign", "Pacing %","Per Day Spent$","Total Budget $", "Total Media Cost $", "Start Date", "End Date"];
    const today = new Date().toLocaleDateString("en-US");
const calculateDaysDiff = (startDate, endDate) => {
  if (!startDate || !endDate) return 0; // return number not string

  let start, end;

  if (startDate.seconds) start = new Date(startDate.seconds * 1000);
  else start = new Date(startDate);

  if (endDate.seconds) end = new Date(endDate.seconds * 1000);
  else end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) return 0;

  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays + 1 : 0;
};
const PerdaySpent = (budget, startDate, endDate) => {
  const days = calculateDaysDiff(startDate, endDate);
    

  const budgetNum = parseFloat(budget) || 0;

  if (days <= 0 || budgetNum <= 0) return 0;

  return budgetNum / days;
};
const daysPassed = (startDate) => {
  if (!startDate) return 0;

  let start;
  if (startDate.seconds) start = new Date(startDate.seconds * 1000);
  else start = new Date(startDate);

  if (isNaN(start)) return 0;

  const today = new Date();

  // difference in ms
  const diffTime = today - start;

  // convert to days
  let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // ✅ add 1 so 09/01 → 09/01 is counted as day 1, not 0
  return diffDays  >= 0 ? diffDays  : 0;
};

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
                    {rows.map((item, index) => (
                        <tr key={item.campaign + index} className="border-b hover:bg-gray-50">
                               <Link
                  to={`/campaign_details/${encodeURIComponent(item.campaign)}`}
                  className="px-4 py-2 text-blue-700 hover:underline"
                >
                  {item.campaign}
                </Link>
                            <td className="px-4 py-2 text-sm text-gray-800 font-semibold"><td className="px-4 py-2 text-sm text-gray-800">{((toFixedOrDash(item.totalMediaCost, 2)/(PerdaySpent(item.totalBudget, item.budget_segment_start_date, item.budget_segment_end_date).toFixed(2)*daysPassed(item.budget_segment_start_date)).toFixed(2))*100).toFixed(2)} %</td></td>
                            {/* <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.totalBudget, 2)} $</td> */}
                            <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(PerdaySpent(item.totalBudget, item.budget_segment_start_date, item.budget_segment_end_date,2))}</td>
                             <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.totalBudget, 2)} $</td>
                            
                            {/* ADDED: New cell to display the total media cost */}
                            {/* <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.totalMediaCost,2)} $</td> */}
                            <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.totalMediaCost,2)} $</td>

                            <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_start_date)}</td>
                            <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_end_date)}</td>
                            {/* <td className="px-4 py-2 text-sm text-gray-800">{calculateDaysDiff(item.budget_segment_start_date, item.budget_segment_end_date)}</td>
                            
                            <td className="px-4 py-2 text-sm text-gray-800">{daysPassed(item.budget_segment_start_date)}</td> */}
    
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}