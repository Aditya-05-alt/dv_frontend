import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import DVlogo from "../assets/DVlogo.png";
import man from "../assets/man.png";
import Loader from "../components/Loader";
import useDV360Data from "../hooks/useDV360";
import TopBar from "../components/dashboard/TopBar";
import Sidebar from "../components/dashboard/Sidebar";
import CampaignFilter from "../components/dashboard/camp_filter";
import Pagination from "../components/dashboard/Pagination";
import ItemsPerPage from "../components/dashboard/ItemsPerPage";
import spinner from "../assets/spinner2.gif";
import BudgetSheetDetails from "../components/dashboard/budgetsheet_data";

export default function BudgetSheet() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { data, campaigns, loading, error } = useDV360Data(db);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");

  const [tableRows, setTableRows] = useState([]);
  
  // **KEY CHANGE 1**: New state to store only user edits.
  // The key will be the campaign ID (e.g., "Fall Sale").
  const [userEdits, setUserEdits] = useState({});

  // ... (no changes to filteredData or campaignSummaryData) ...
  const filteredData = useMemo(() => {
    return filter === "all" ? data : data.filter((item) => item.campaign === filter);
  }, [data, filter]);

  const campaignSummaryData = useMemo(() => {
    const summary = filteredData.reduce((acc, item) => {
      const campaignName = item.campaign;
      if (!acc[campaignName]) {
        acc[campaignName] = { campaign: campaignName, totalBudget: 0, budget_segment_start_date: item.budget_segment_start_date, budget_segment_end_date: item.budget_segment_end_date, totalMediaCost: 0 };
      }
      acc[campaignName].totalBudget += item.budget_segment_budget || 0;
      acc[campaignName].totalMediaCost += item.total_media_cost_usd || 0;
      return acc;
    }, {});
    return Object.values(summary);
  }, [filteredData]);

  // **KEY CHANGE 2**: This effect now MERGES the source data with your saved edits.
  useEffect(() => {
    const mergedTableData = campaignSummaryData.map((row) => {
      const campaignId = row.campaign;
      const editsForThisRow = userEdits[campaignId] || {}; // Get saved edits or an empty object

      return {
        ...row, // Start with the base data (campaign name, etc.)
        id: campaignId,
        grossBudget: editsForThisRow.grossBudget || "", // Use saved edit or default to empty
        netBudget: editsForThisRow.netBudget || "",
        markup: editsForThisRow.markup || "",
      };
    });
    setTableRows(mergedTableData);
  }, [campaignSummaryData, userEdits]); // Re-run when source data OR edits change

  useEffect(() => { setCurrentPage(1); }, [filter, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(tableRows.length / itemsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return tableRows.slice(start, end);
  }, [tableRows, currentPage, itemsPerPage]);

  const handleLogout = () => { logout(); navigate("/login"); };

  // **KEY CHANGE 3**: The handler now updates the `userEdits` state.
  const handleInputChange = (id, fieldName, value) => {
    setUserEdits(prevEdits => {
      const currentEditsForId = prevEdits[id] || {};
      let updatedEdits = { ...currentEditsForId, [fieldName]: value };

      // Re-apply the calculation logic when Gross Budget changes
      if (fieldName === 'grossBudget') {
        const grossValue = parseFloat(value);
        const newNet = !isNaN(grossValue) ? (grossValue * 0.65).toFixed(2) : "";
        updatedEdits.netBudget = newNet;
      }
      
      return {
        ...prevEdits,
        [id]: updatedEdits,
      };
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <TopBar logoSrc={DVlogo} avatarSrc={man} email={authUser?.email} onLogout={handleLogout} onAvatarClick={() => setDropdownOpen(s => !s)} dropdownOpen={dropdownOpen} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 p-8 overflow-auto">
          <h2 className="text-2xl font-semibold text-gray-700">Budget Sheet</h2>
          <CampaignFilter data={data} campaigns={campaigns} filter={filter} setFilter={setFilter} />
          <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
            <ItemsPerPage value={itemsPerPage} onChange={(value) => setItemsPerPage(Number(value))} />
          </div>
          {loading ? ( <div className="flex justify-center items-center h-64"><Loader gifSrc={spinner} size={75} label=" " /></div> ) : error ? ( <p className="text-red-600">{error}</p> ) : (
            <BudgetSheetDetails rows={paginatedRows} handleInputChange={handleInputChange} />
          )}
          {!loading && tableRows.length > 0 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPrev={() => setCurrentPage(p => Math.max(1, p - 1))} onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))} />
          )}
        </div>
      </div>
    </div>
  );
}