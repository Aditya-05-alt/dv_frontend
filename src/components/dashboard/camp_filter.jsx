import React from "react";
import { useMemo } from "react";


export default function CampaignFilter({ campaigns, filter, setFilter, data }) {
  const filteredCampaignOrders = useMemo(() => {
    if (filter === "all") return campaigns;
    const relevant = new Set(
      data.filter((d) => d.campaign === filter).map((d) => d.campaign)
    );
    return campaigns.filter((io) => relevant.has(io.name));
  }, [filter, campaigns, data]);
  

  return (
    <div className="mt-5 flex items-center space-x-2">
      <select
        id="campaign-filter"
        className="p-2 border border-gray-300 rounded min-w-[260px] w-1/2"
        // FIX 1: The value should be the 'filter' state prop
        value={filter}
        // FIX 2: The onChange should call the 'setFilter' prop
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Campaigns</option>
        {filteredCampaignOrders.map((io, idx) => (
          <option key={idx} value={io.name}>
            {io.name} ({io.count})
          </option>
        ))}
      </select>
    </div>
  );
}