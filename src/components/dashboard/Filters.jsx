import React, { useMemo } from "react";

export default function Filters({
  campaigns,
  insertionOrders,
  data,
  filter,
  setFilter,
  insertionFilter,
  setInsertionFilter,
}) {
  // dependent IO list based on selected campaign
  const filteredInsertionOrders = useMemo(() => {
    if (filter === "all") return insertionOrders;
    const relevant = new Set(
      data.filter((d) => d.campaign === filter).map((d) => d.insertion_order)
    );
    return insertionOrders.filter((io) => relevant.has(io.name));
  }, [filter, insertionOrders, data]);

  return (
    <div className="mt-5 flex items-center space-x-2">
      <select
        id="campaign-filter"
        className="p-2 border border-gray-300 rounded min-w-[260px] w-1/2"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setInsertionFilter("all");
        }}
      >
        <option value="all">All Campaigns</option>
        {campaigns.map((c, idx) => (
          <option key={idx} value={c.name}>
            {c.name} ({c.count})
          </option>
        ))}
      </select>

      <select
        id="insertion-filter"
        className="p-2 border border-gray-300 rounded min-w-[260px] w-1/2"
        value={insertionFilter}
        onChange={(e) => setInsertionFilter(e.target.value)}
      >
        <option value="all">All Insertion Orders</option>
        {filteredInsertionOrders.map((io, idx) => (
          <option key={idx} value={io.name}>
            {io.name} ({io.count})
          </option>
        ))}
      </select>
    </div>
  );
}
