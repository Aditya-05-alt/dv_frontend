import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import DVlogo from "../assets/DVlogo.png";
import man from "../assets/man.png";
import Loader from "../components/Loader";
import useDV360Data from "../hooks/useDV360";
import TopBar from "../components/dashboard/TopBar";
import Sidebar from "../components/dashboard/Sidebar";
import Filters from "../components/dashboard/Filters";
import ItemsPerPage from "../components/dashboard/ItemsPerPage";
import DownloadCsvButton from "../components/dashboard/DownloadCsvButton";
import DataTable from "../components/dashboard/DataTable";
import TotalsBar from "../components/dashboard/TotalsBar";
import Pagination from "../components/dashboard/Pagination";
import spinner from "../assets/spinner2.gif"

export default function Dashboard() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { data, campaigns, insertionOrders, loading, error } = useDV360Data(db);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [insertionFilter, setInsertionFilter] = useState("all");

  // filter on campaign + insertion order
  const filteredData = useMemo(() => {
    let res = data;
    if (filter !== "all") res = res.filter((r) => r.campaign === filter);
    if (insertionFilter !== "all") res = res.filter((r) => r.insertion_order === insertionFilter);
    return res;
  }, [data, filter, insertionFilter]);

  // reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, insertionFilter, itemsPerPage]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const end = currentPage * itemsPerPage;
    const start = end - itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage]);

  // CSV prep for the current page
  const csvHeaders = [
    "Campaign",
    "Insertion Order",
    "Pacing %",
    "Start Date",
    "End Date",
    "Segment",
    "Total Media Cost",
    "Impressions",
    "Complete Views",
    "Completion Rate",
    "Media Cost (eCPM)",
  ];
  const csvRows = paginatedData.map((item) => [
    item.campaign,
    item.insertion_order,
    item.budget_segment_pacing_percentage,
    // keep raw date values in export to avoid locale issues
    item.budget_segment_start_date?.seconds ? new Date(item.budget_segment_start_date.seconds * 1000).toISOString().slice(0,10) : "",
    item.budget_segment_end_date?.seconds ? new Date(item.budget_segment_end_date.seconds * 1000).toISOString().slice(0,10) : "",
    item.budget_segment_name,
    item.total_media_cost_usd,
    item.impressions,
    item.complete_views_video,
    item.completion_rate_video,
    item.total_media_cost_ecpm_usd,
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <TopBar
        logoSrc={DVlogo}
        avatarSrc={man}
        email={authUser?.email}
        onLogout={handleLogout}
        onAvatarClick={() => setDropdownOpen((s) => !s)}
        dropdownOpen={dropdownOpen}
      />

      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex-1 p-8 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-700">Insertion Data</h2>

          <Filters
            campaigns={campaigns}
            insertionOrders={insertionOrders}
            data={data}
            filter={filter}
            setFilter={setFilter}
            insertionFilter={insertionFilter}
            setInsertionFilter={setInsertionFilter}
          />

          <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
            <ItemsPerPage value={itemsPerPage} onChange={setItemsPerPage} />
            <DownloadCsvButton headers={csvHeaders} rows={csvRows} />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64"><Loader gifSrc={spinner} size={75} label=" "/></div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              <DataTable rows={paginatedData} />
              <TotalsBar rows={filteredData} />
            </>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}
