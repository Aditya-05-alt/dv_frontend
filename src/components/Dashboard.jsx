// import React, { useState, useEffect, useMemo } from "react";
// import { FaHome, FaChartLine, FaCogs, FaUsers, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthProvider";
// import { db } from "../../firebase";  // Import Firestore from firebase.js
// import { collection, doc, getDocs } from "firebase/firestore"; // Firestore methods
// import DVlogo from "../assets/DVlogo.png";
// import man from "../assets/man.png";
// import Loader from "../Loader";  
// import { saveAs } from "file-saver"; // Import your Loader component

// const Dashboard_t = () => {
//   const { user: authUser, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [campaigns, setCampaigns] = useState([]);
//     // State to store campaigns for filter
//   const [insertionOrders, setInsertionOrders] = useState([]) 
//   const [data, setData] = useState([]);  // State to store fetched data
//   const [loading, setLoading] = useState(true);  // Loading state for fetching data
//   const [error, setError] = useState(null);  // Error state for handling any issues with data fetching
//   const [itemsPerPage, setItemsPerPage] = useState(5);  // Default items per page
//   const [currentPage, setCurrentPage] = useState(1);  // Default page is 1
//   const [filter, setFilter] = useState("all");  // Filter state for selected campaign
//   const navigate = useNavigate();
//   const [campaignToInsertionMap, setCampaignToInsertionMap] = useState({});
//   const [insertionFilter, setInsertionFilter] = useState("all");

//   // Fetch campaigns and data from Firestore on component mount
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       // Fetch campaign data from "DV_360Full" collection
//       const campaignSnapshot = await getDocs(collection(db, "DV_360Full"));
//       const campaignData = [];
//       const campaignList = [];
//       const insertionOrderList = [];
//       const campaignToInsertionMap = {};


//       campaignSnapshot.forEach((doc) => {
//   const data = { id: doc.id, ...doc.data() };
//   campaignData.push(data);

//   const campaignName = data.campaign;
//   const insertionOrder = data.insertion_order;

//   if (campaignName) {
//     campaignList.push(campaignName);

//     if (!campaignToInsertionMap[campaignName]) {
//       campaignToInsertionMap[campaignName] = new Set();
//     }

//     if (insertionOrder) {
//       campaignToInsertionMap[campaignName].add(insertionOrder);
//     }
//   }

//   if (insertionOrder) {
//     insertionOrderList.push(insertionOrder);
//   }
// });
// setCampaignToInsertionMap(campaignToInsertionMap);

//       setData(campaignData);
//         // Set data for the table

//       // Count the occurrences of each campaign
//       const campaignCount = campaignList.reduce((acc, campaign) => {
//         acc[campaign] = (acc[campaign] || 0) + 1;
//         return acc;
//       }, {});

//       const insertionOrderCount = insertionOrderList.reduce((acc, insertionOrder) => {
//         acc[insertionOrder] = (acc[insertionOrder] || 0) + 1;
//         return acc;
//       }, {});

//       // Create a list of campaigns with count for the dropdown
//       const uniqueCampaigns = Object.keys(campaignCount).map(campaign => ({
//         name: campaign,
//         count: campaignCount[campaign]
//       }));

//       const uniqueInsertionOrders = Object.keys(insertionOrderCount).map(insertionOrder => ({
//         name: insertionOrder,
//         count: insertionOrderCount[insertionOrder],
//       }));
//       setInsertionOrders(uniqueInsertionOrders);
//       setCampaigns(uniqueCampaigns); // Set campaigns with count for dropdown
//     } catch (error) {
//       setError("Error fetching data: " + error.message);
//     } finally {
//       setLoading(false);  // Stop loading once data is fetched
//     }
//   };

//   fetchData();
// }, []);


// useEffect(() => {
//   setInsertionFilter("all");
// }, [filter]);// Empty dependency array ensures this runs only once

//   // Handle filter change
//   const handleFilterChange = (e) => {
//     const selectedFilter = e.target.value;
//     setFilter(selectedFilter);  // Update filter state
//   };

//   // Handle change in items per page
//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value)); // Update items per page
//     setCurrentPage(1); // Reset to first page whenever items per page changes
//   };

//   // Handle pagination buttons (Next/Previous)
//   const nextPage = () => {
//     if (currentPage < Math.ceil(data.length / itemsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Filter data based on selected campaign
//   const filteredData = useMemo(() => {
//   let result = data;

//   if (filter !== "all") {
//     result = result.filter(item => item.campaign === filter);
//   }

//   if (insertionFilter !== "all") {
//     result = result.filter(item => item.insertion_order === insertionFilter);
//   }

//   return result;
// }, [filter, insertionFilter, data]);


//   // Paginate filtered data
//   const paginatedData = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   }, [currentPage, itemsPerPage, filteredData]);

//   const downloadCSV = () => {
//     const headers = [
//       "Campaign", "Insertion Order", "Pacing %", "Start Date", "End Date",
//       "Segment", "Total Media Cost", "Impressions", "Complete Views", "Completion Rate", "Media Cost (eCPM)"
//     ];

//     const rows = paginatedData.map(item => [
//       item.campaign, item.insertion_order, item.budget_segment_pacing_percentage, 
//       formatDate(item.budget_segment_start_date), formatDate(item.budget_segment_end_date),
//       item.budget_segment_name, item.total_media_cost_usd, item.impressions,
//       item.complete_views_video, item.completion_rate_video, item.total_media_cost_ecpm_usd
//     ]);

//     let csvContent = headers.join(",") + "\n";
//     rows.forEach(row => {
//       csvContent += row.join(",") + "\n";
//     });

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "campaign_data.csv");
//   };

//   const handleLogout = () => {
//     logout();  // Call logout from context
//     navigate("/login");  // Redirect to login page
//   };

//   // Helper function to format Firestore timestamp or date string
//   const formatDate = (date) => {
//     if (date) {
//       const dateObj = new Date(date.seconds * 1000);  // Convert Firestore timestamp to Date object
//       return dateObj.toLocaleDateString("en-US");  // Format date to "MM/DD/YYYY"
//     }
//     return "";  // If no date, return empty string
//   };

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const grandTotal = {
//     totalMediaCost: filteredData.reduce((acc, item) => acc + parseFloat(item.total_media_cost_usd || 0), 0),
//     totalImpressions: filteredData.reduce((acc, item) => acc + parseInt(item.impressions || 0), 0),
//     totalCompleteViews: filteredData.reduce((acc, item) => acc + parseInt(item.complete_views_video || 0), 0),
//     totalCompletionRate: filteredData.reduce((acc, item) => acc + parseFloat(item.completion_rate_video || 0), 0),
//     totalECPM: filteredData.reduce((acc, item) => acc + parseFloat(item.total_media_cost_ecpm_usd || 0), 0),
//   };
//   const filteredInsertionOrders = useMemo(() => {
//   if (filter === "all") return insertionOrders;

//   const relevantSet = new Set(
//     data
//       .filter((item) => item.campaign === filter)
//       .map((item) => item.insertion_order)
//   );

//   return insertionOrders.filter((io) => relevantSet.has(io.name));
// }, [filter, insertionOrders, data]);

// const calculateDaysDiff = (startDate, endDate) => {
//   if (!startDate || !endDate) return "";

//   const start = new Date(startDate.seconds * 1000);
//   const end = new Date(endDate.seconds * 1000);

//   // Difference in milliseconds → convert to days
//   const diffTime = Math.abs(end - start);
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   return diffDays;
// };


//   return (
//     <div className="flex min-h-screen bg-gray-100 flex-col">
//       {/* AppBar */}
//       <div className="bg-blue-700 text-white p-6 flex justify-between items-center shadow-md w-full sticky">
//         <div className="flex items-center space-x-3">
//           <img src={DVlogo} alt="Logo" className="w-10 h-10" />
//           <h1 className="text-xl font-semibold">DV 360</h1>
//         </div>

//         {/* User Email & Avatar with Dropdown */}
//         <div className="relative flex items-center space-x-3">
//           <img
//             src={man}
//             alt="User Avatar"
//             className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           />
//           <span className="text-sm">{authUser ? authUser.email : "User"}</span>
//           {dropdownOpen && (
//             <div
//               className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-10"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <div
//           className={`${sidebarOpen ? "w-64" : "w-20"} bg-blue-500 text-white p-6 transition-all duration-300`}
//         >
//           <button
//             className="text-white mb-6"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <span className={`${sidebarOpen ? "block" : "hidden"}`}><FaArrowLeft size={20} /></span>
//             <span className={`${!sidebarOpen ? "block" : "hidden"}`}><FaArrowRight size={20} /></span>
//           </button>

//           <ul className="space-y-4">
//             <li>
//               <Link to="/dashboard" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
//                 <FaHome size={20} />
//                 {sidebarOpen && <span>Home</span>}
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Dashboard Content */}
//         <div className="flex-1 p-8 overflow-auto">
//           <div className="items-center mb-4">
//             <div className="">
//             <h2 className="text-2xl font-semibold text-gray-700 flex">Campaign Data</h2>

//             {/* Filter Dropdown */}
//           <div className="mt-5 flex items-center space-x-2">
//                 <select
//                   id="filter"
//                   className="p-2 border border-gray-300 rounded w-1/2"
//                   value={filter}
//                   onChange={handleFilterChange}
//                 >
//                   <option value="all">All Campaigns</option>
//                   {campaigns.map((campaign, index) => (
//                     <option key={index} value={campaign.name}>
//                       {campaign.name} ({campaign.count})
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                 id="insertion-filter"
//                 className="p-2 border border-gray-300 rounded w-1/2"
//                 value={insertionFilter}
//                 onChange={(e) => setInsertionFilter(e.target.value)}
//               >
//                 <option value="all">All Insertion Orders</option>
//                 {filteredInsertionOrders.map((insertionOrder, index) => (
//                   <option key={index} value={insertionOrder.name}>
//                     {insertionOrder.name} ({insertionOrder.count})
//                   </option>
//                 ))}
//               </select>

//               </div>
            
//             </div>

//             {/* Items per page */}
//             <div className="flex space-between mt-5">
//             <div className="mb-4">
//               <label htmlFor="items-per-page" className="text-sm text-gray-700">Items per page:</label>
//               <select
//                 id="items-per-page"
//                 value={itemsPerPage}
//                 onChange={handleItemsPerPageChange}
//                 className="ml-2 p-2 border border-gray-300 rounded"
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={15}>15</option>
//               </select>
//             </div>

//             {/* Download Button */}
//             <div className="ml-4 inline-block">
//               <button onClick={downloadCSV} className="w-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                 <FaDownload />
//               </button>
//             </div>
//           </div>
//           </div>

//           {/* Loading state */}
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader />
//             </div>
//           ) : error ? (
//             <p className="text-red-600">{error}</p>
//           ) : (
//             <div className="overflow-x-auto shadow-md mt-4">
//               <table className="min-w-full table-auto">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     {["Campaign", "Insertion Order", "Pacing %", "Budget Seg. Start Date", "Budget Seg. End Date", "Budget Segment Budget","Days Diff" ,"Total Media Cost", "Impressions", "Complete Views", "Completion Rate", "Media Cost (eCPM)"].map((header) => (
//                       <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{header}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedData.map((item) => (
//                     <tr key={item.id} className="border-b hover:bg-gray-50">
//                       <td className="px-4 py-2 text-sm text-gray-800">{item.campaign}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">
//                         <Link className="text-blue-700">{item.insertion_order}</Link>
//                         </td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{parseFloat(item.budget_segment_pacing_percentage).toFixed(2)}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{item.budget_segment_start_date}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{item.budget_segment_end_date}</td>
                      
//                       <td className="px-4 py-2 text-sm text-gray-800">{parseFloat(item.budget_segment_budget).toFixed(2)}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{parseFloat(item.total_media_cost_usd).toFixed(3)}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{item.impressions}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{item.complete_views_video}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{parseFloat(item.completion_rate_video).toFixed(2)}</td>
//                       <td className="px-4 py-2 text-sm text-gray-800">{parseFloat(item.total_media_cost_ecpm_usd).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="bg-gray-100 mt-4">
//                 <table className="w-full table-auto">
//                   <thead>
//                     <tr className="bg-gray-200">
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600" colSpan={6}>Grand Total</th>
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalMediaCost.toFixed(2)}</th>
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalImpressions}</th>
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalCompleteViews}</th>
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{(grandTotal.totalCompletionRate / filteredData.length).toFixed(2)}%</th>
//                       <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">{grandTotal.totalECPM.toFixed(2)}</th>
//                     </tr>
//                   </thead>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="flex justify-between mt-4">
//             <button onClick={prevPage} className="px-4 py-2 bg-blue-600 text-white rounded">
//               Previous
//             </button>
//             <span className="flex items-center text-sm text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button onClick={nextPage} disabled={currentPage === totalPages || totalPages === 1} className={`px-4 py-2 rounded transition-colors duration-200 ${
//     currentPage === totalPages || totalPages === 1
//       ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//       : "bg-blue-600 text-white hover:bg-blue-700"
//   }`}>
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard_t;
