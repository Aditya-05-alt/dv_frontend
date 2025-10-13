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
import DataTable_camp from "../components/dashboard/data_campaign";
import ItemsPerPage from "../components/dashboard/ItemsPerPage";
import DownloadCsvButton from "../components/dashboard/DownloadCsvButton";
import spinner from "../assets/spinner2.gif"

export default function Dashboard_campaign() {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const { data, campaigns, loading, error } = useDV360Data(db);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("all");

    const filteredData = useMemo(() => {
        return filter === "all" ? data : data.filter((item) => item.campaign === filter);
    }, [data, filter]);

    const campaignSummaryData = useMemo(() => {
        const summary = filteredData.reduce((acc, item) => {
            const campaignName = item.campaign;

            if (!acc[campaignName]) {
                acc[campaignName] = {
                    campaign: campaignName,
                    totalBudget: 0,
                    budget_segment_start_date: item.budget_segment_start_date, 
                    budget_segment_end_date: item.budget_segment_end_date,
                    // ADDED: Initialize the new total media cost field
                    totalMediaCost: 0,
                };
            }

            // Sum the budget segment
            acc[campaignName].totalBudget += item.budget_segment_budget || 0;
            
            // ADDED: Sum the total media cost
            acc[campaignName].totalMediaCost += item.total_media_cost_usd || 0;
            
            return acc;
        }, {});
        
        return Object.values(summary);
    }, [filteredData]);
    console.log(campaignSummaryData);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter, itemsPerPage]);
    
    const totalPages = Math.max(1, Math.ceil(campaignSummaryData.length / itemsPerPage));
    
    const paginatedSummaryData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return campaignSummaryData.slice(start, end);
    }, [campaignSummaryData, currentPage, itemsPerPage]);

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
                    <h2 className="text-2xl font-semibold text-gray-700">Campaign Data</h2>
                    <CampaignFilter
                        data={data}
                        campaigns={campaigns}
                        filter={filter}
                        setFilter={setFilter}
                    />
                    <div className="flex items-center justify-between mt-5 flex-wrap gap-4">
                        <ItemsPerPage value={itemsPerPage} onChange={(value) => setItemsPerPage(Number(value))} />
                        <DownloadCsvButton />
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Loader gifSrc={spinner} size={75} label=" "/></div>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : (
                        <DataTable_camp rows={paginatedSummaryData} />
                    )}
                    {!loading && campaignSummaryData.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}