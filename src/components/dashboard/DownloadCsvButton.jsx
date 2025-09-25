import React from "react";
import { FaDownload } from "react-icons/fa";
import { saveAs } from "file-saver";
import { toCsv } from "../../utils/csv";

export default function DownloadCsvButton({ headers, rows, fileName = "campaign_data.csv" }) {
  const download = () => {
    const csv = toCsv(headers, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };
  return (
    <button onClick={download} className="w-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      <FaDownload />
    </button>
  );
}
