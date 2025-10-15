import React from 'react';
import { formatFsDate, toFixedOrDash } from '../../utils/formatters';
import { calculatePacing, daysPassed } from '../../utils/pacingCalculations';
import { Link } from 'react-router-dom';

export default function CampaignDetailsTable({ rows }) {
  const headers = [
    "Campaign", "Insertion Order", "Pacing", "Start Date", "End Date",
    "Budget", "Media Cost", "Impressions", "Complete Views",
    "Completion Rate", "eCPM", "Days Passed"
  ];
  
  return (
    <div className="overflow-x-auto shadow-md mt-4">
        <div className='mb-4'>

        </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            // Perform calculations for each row
            const pacing = calculatePacing(
              item.total_media_cost_usd,
              item.budget_segment_budget,
              item.budget_segment_start_date,
              item.budget_segment_end_date
            );
            
            return (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800 text-blue-700">{item.campaign}</td>
                <Link to={`/insertion_details/${encodeURIComponent(item.insertion_order)}`} className="text-blue-700">
                <td className="px-4 py-2 text-sm text-blue-800 hover:underline">{item.insertion_order}</td></Link>
                <td className="px-4 py-2 text-sm text-gray-800 font-semibold">{toFixedOrDash(pacing, 2)}%</td>
                <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_start_date)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{formatFsDate(item.budget_segment_end_date)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.budget_segment_budget, 2)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.total_media_cost_usd, 3)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.impressions ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.complete_views_video ?? "-"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.completion_rate_video, 2)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{toFixedOrDash(item.total_media_cost_ecpm_usd, 2)}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{daysPassed(item.budget_segment_start_date)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}