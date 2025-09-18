import React, { useState, useEffect, useMemo } from "react";
import { FaHome, FaChartLine, FaCogs, FaUsers, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";  // Import Firestore from firebase.js
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import DVlogo from "../assets/DVlogo.png";
import man from "../assets/man.png";
import Loader from "../components/Loader";  // Import your Loader component

const Dashboard = () => {
  const { user: authUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [data, setData] = useState([]);  // State to store fetched data
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const [error, setError] = useState(null);  // Error state for handling any issues with data fetching
  const [itemsPerPage, setItemsPerPage] = useState(5);  // Default items per page
  const [currentPage, setCurrentPage] = useState(1);  // Default page is 1
  const navigate = useNavigate();

  // Fetch data from Firestore (only once on component mount)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "DV360_data"));  // Replace "DV360_data" with your Firestore collection name
        const campaignData = [];
        querySnapshot.forEach((doc) => {
          campaignData.push({ id: doc.id, ...doc.data() });
        });
        setData(campaignData);  // Set data
      } catch (error) {
        setError("Error fetching data: " + error.message);
      } finally {
        setLoading(false);  // Stop loading once data is fetched
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  // Handle change in items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update items per page
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  // Handle pagination buttons (Next/Previous)
  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Paginate data based on current page and items per page
  const paginatedData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, data]); // Re-run pagination when data, currentPage, or itemsPerPage changes

  const handleLogout = () => {
    logout();  // Call logout from context
    navigate("/login");  // Redirect to login page
  };

  // Helper function to format Firestore timestamp or date string
  const formatDate = (date) => {
    if (date) {
      const dateObj = new Date(date.seconds * 1000);  // Convert Firestore timestamp to Date object
      return dateObj.toLocaleDateString("en-US");  // Format date to "MM/DD/YYYY"
    }
    return "";  // If no date, return empty string
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const grandTotal = {
    totalMediaCost: data.reduce((acc, item) => acc + parseFloat(item.total_media_cost_usd || 0), 0),
    totalImpressions: data.reduce((acc, item) => acc + parseInt(item.impressions || 0), 0),
    totalCompleteViews: data.reduce((acc, item) => acc + parseInt(item.complete_views_video || 0), 0),
    totalCompletionRate: data.reduce((acc, item) => acc + parseFloat(item.completion_rate_video || 0), 0),
    totalECPM: data.reduce((acc, item) => acc + parseFloat(item.total_media_cost_ecpm_usd || 0), 0),
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      {/* AppBar */}
      <div className="bg-blue-700 text-white p-6 flex justify-between items-center shadow-md w-full sticky">
        <div className="flex items-center space-x-3">
          <img src={DVlogo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-semibold">DV 360</h1>
        </div>

        {/* User Email & Avatar with Dropdown */}
        <div className="relative flex items-center space-x-3">
          <img
            src={man}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <span className="text-sm">{authUser ? authUser.email : "User"}</span>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-20"} bg-blue-500 text-white p-6 transition-all duration-300`}
        >
          <button
            className="text-white mb-6"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className={`${sidebarOpen ? "block" : "hidden"}`}><FaArrowLeft size={20} /></span>
            <span className={`${!sidebarOpen ? "block" : "hidden"}`}><FaArrowRight size={20} /></span>
          </button>

          <ul className="space-y-4">
            <li>
              <Link to="/dashboard" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
                <FaHome size={20} />
                {sidebarOpen && <span>Home</span>}
              </Link>
            </li>
            <li>
              <Link to="#!" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
                <FaChartLine size={20} />
                {sidebarOpen && <span>Reports (coming soon)</span>}
              </Link>
            </li>
            <li>
              <Link to="#!" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
                <FaCogs size={20} />
                {sidebarOpen && <span>Settings (coming soon)</span>}
              </Link>
            </li>
            <li>
              <Link to="#!" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
                <FaUsers size={20} />
                {sidebarOpen && <span>Analytics (coming soon)</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 flex">Campaign Data</h2>
          
          <div className="mb-4">
            
                <label htmlFor="items-per-page" className="text-sm text-gray-700">Items per page:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="ml-2 p-2 border border-gray-300 rounded"
                >
                  <option value={5} >5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
                <div className="ml-4 inline-block">
                <button className="w-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <FaDownload />
          </button>
          </div>
              </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />  {/* Show the loader while fetching data */}
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
            // {/* Show error if there's an issue fetching data */}
          ) : (
            <div className="overflow-x-auto shadow-md mt-4">

              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    {["Campaign", "Insertion Order", "Pacing %", "Budget Seg. Start Date", " Budget Seg. End Date", "Budget Segment", "Total Media Cost", "Impressions", "Complete Views", "Completion Rate", "Media Cost (eCPM)"].map((header) => (
                      <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">{item.campaign}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.insertion_order}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.budget_segment_pacing_percentage}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{formatDate(item.budget_segment_start_date)}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{formatDate(item.budget_segment_end_date)}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.budget_segment_name}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.total_media_cost_usd}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.impressions}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.complete_views_video}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.completion_rate_video}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.total_media_cost_ecpm_usd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-100 mt-4">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Grand Total</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalMediaCost.toFixed(2)}</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalImpressions}</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalCompleteViews}</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{(grandTotal.totalCompletionRate / data.length).toFixed(2)}%</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalECPM.toFixed(2)}</th>
                    </tr>
                  </thead>
                </table>
              </div>  
            </div>
          )}
          <div className="flex justify-between mt-4">
            <button onClick={prevPage} className="px-4 py-2 bg-blue-600 text-white rounded">
              Previous
            </button>
            <span className="flex items-center text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage} className="px-4 py-2 bg-blue-600 text-white rounded">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;