import React from "react";

export default function ItemsPerPage({ value, onChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="items-per-page" className="text-sm text-gray-700">Items per page:</label>
      <select
        id="items-per-page"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ml-2 p-2 border border-gray-300 rounded"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
      </select>
    </div>
  );
}
