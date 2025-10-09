import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // ✅ Import useParams
import { useAuth } from '../auth/AuthProvider';
import { db } from '../firebase';
import DVlogo from '../assets/DVlogo.png';
import man from '../assets/man.png';
import Loader from '../components/Loader';
import useDV360Data from '../hooks/useDV360Data';
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import CampaignDetailsTable from '../components/dashboard/CampaignDetailsTable';
import spinner from '../assets/spinner2.gif';

export default function Campaign_details() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error } = useDV360Data(db);

  // ✅ Get the dynamic part of the URL (the campaign name)
  const { campaignName } = useParams();
  
  // ✅ Decode the campaign name back to its original format (e.g., with spaces)
  const decodedCampaignName = useMemo(() => decodeURIComponent(campaignName), [campaignName]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ This logic now filters data based on the campaign name from the URL
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => item.campaign === decodedCampaignName);
  }, [data, decodedCampaignName]);

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
          {/* ✅ The heading is now dynamic */}
          
          <h2 className="text-2xl font-semibold text-gray-700 ">
            Insertion Orders for: 
            <Link to="/dashboard_camp" className="ml-2  text-blue-600 hover:underline">
            <span className="text-blue-700">{decodedCampaignName}</span>
            </Link>
          </h2>

          {loading && <Loader gifSrc={spinner} size={75} label=" "/>}
          {error && <p className="mt-4 text-center text-red-500">Error: {error.message}</p>}
          
          {/* ✅ The table receives the data filtered specifically for this campaign */}
          {data && <CampaignDetailsTable rows={filteredData} />}
        </div>
      </div>
    </div>
  );
}