import React, { useMemo } from "react";

export default function TotalsBar({ rows }) {
  const totals = useMemo(() => {
    if (!rows.length) {
      return {
        totalMediaCost: 0,
        totalImpressions: 0,
        totalCompleteViews: 0,
        avgCompletionRate: 0,
        totalECPM: 0,
      };
    }
    const tMedia = rows.reduce((a, r) => a + parseFloat(r.total_media_cost_usd || 0), 0);
    const tImp = rows.reduce((a, r) => a + parseInt(r.impressions || 0), 0);
    const tViews = rows.reduce((a, r) => a + parseInt(r.complete_views_video || 0), 0);
    const tCR = rows.reduce((a, r) => a + parseFloat(r.completion_rate_video || 0), 0);
    const tECPM = rows.reduce((a, r) => a + parseFloat(r.total_media_cost_ecpm_usd || 0), 0);
    return {
      totalMediaCost: tMedia,
      totalImpressions: tImp,
      totalCompleteViews: tViews,
      avgCompletionRate: tCR / rows.length,
      totalECPM: tECPM,
    };
  }, [rows]);

  return (
    <div className="bg-gray-100 mt-4">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600" colSpan={6}>Grand Total</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{totals.totalMediaCost.toFixed(2)}</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{totals.totalImpressions}</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{totals.totalCompleteViews}</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{totals.avgCompletionRate.toFixed(2)}%</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{totals.totalECPM.toFixed(2)}</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
