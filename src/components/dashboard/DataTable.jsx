import { Link } from "react-router-dom";
import { formatFsDate, toFixedOrDash } from "../../utils/formatters";
import { remainingBudget, remainingDays } from "../../utils/perDayspent";


export default function DataTable({ rows }) {
  const headers = [
    "Campaign",
    "Insertion Order",
    "Pacing %",
    "Last Day Spent $",
    "Start Date",
    "End Date",
    "Per Day Spend Needed $",
    "Budget $",
    "Total Media Cost $",
    "Last Day Impressions",
    "Total Impressions",
    "Complete Views",
    "Completion Rate",
    "Media Cost (eCPM)",
    "Current Date", //remove after use 
    "Total Days", // remove after use 
  ];
  
  
// Full PAcing Callculation Steps: 
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

  return diffDays > 0 ? diffDays+1 : 0;
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
  return diffDays + 1 >= 0 ? diffDays + 1 : 0;
};
// 

  return (
    <div className="overflow-x-auto shadow-md mt-4">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr >
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-800">{item.campaign}</td>
              <td className="px-4 py-2 text-smtext-blue-600 hover:underline">
                <Link to={`/insertion_details/${encodeURIComponent(item.insertion_order)}`} className="text-blue-700">{item.insertion_order}</Link>
              </td>
              {/* <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.budget_segment_pacing_percentage, 2)}</td> */}
              <td className="px-4 py-2 text-sm text-gray-800">{((toFixedOrDash(item.total_media_cost_usd, 3)/(PerdaySpent(item.budget_segment_budget, item.budget_segment_start_date, item.budget_segment_end_date).toFixed(2)*daysPassed(item.budget_segment_start_date)).toFixed(2))*100).toFixed(3)}%</td>
              <td className="px-4 py-2 text-sm text-gray-800">{"$ " +toFixedOrDash(item.dailySpend, 2)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_start_date)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_end_date)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{"$ "+(remainingBudget(item.budget_segment_budget, item.total_media_cost_usd) / remainingDays(today, item.budget_segment_end_date)).toFixed(2) }</td>
              <td className="px-4 py-2 text-sm text-gray-800">{"$ "+ toFixedOrDash(item.budget_segment_budget, 2)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{"$ "+ toFixedOrDash(item.total_media_cost_usd, 2)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{item.dailyImpressions ?? "-"}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{item.impressions ?? "-"}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{item.complete_views_video ?? "-"}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.completion_rate_video, 2)*100 + "%"}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.total_media_cost_ecpm_usd, 2)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{today}</td> {/* // #remove after use */}
                {/* <td className="px-4 py-2 text-sm text-gray-800">{daysPassed(item.budget_segment_start_date)}</td>  */}
                <td className="px-4 py-2 text-sm text-gray-800">{calculateDaysDiff(item.budget_segment_start_date, item.budget_segment_end_date)}</td> {/* // #remove after use */}
              {/* <td className="px-4 py-2 text-sm text-gray-800">{remainingBudget(item.budget_segment_budget, item.total_media_cost_usd).toFixed(2)}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{remainingDays(today, item.budget_segment_end_date)}</td> */}
               
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
