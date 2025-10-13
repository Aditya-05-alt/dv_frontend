// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth/AuthProvider";
// import Login from "./components/test_pages/Login";
// import Signup from "./components/test_pages/Signup";
// import Dashboard from "./components/test_pages/Dashboard";
import LoginPage from "./pages/loginpage";
import SignupPage from "./pages/signuppage";
import Dashboard_t from "./pages/Dashboard";
import Dashboard_campaign from "./pages/Dashboard_campaign";
import Campaign_details from "./pages/campaign_details";
import Insertion_details from "./pages/insertion_details";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard_t/>} />
          {/* Dashboard Insertion level route */}
           <Route 
      path="/dashboard_camp" 
      element={
        <PrivateRoute>
          <Dashboard_campaign />
        </PrivateRoute>
      } 
    />
    {/* Campaign data details */}
    <Route
      path="/campaign_details/:campaignName"
      element={
        <PrivateRoute>
          <Campaign_details />
        </PrivateRoute>
      }
    />
    {/* Insertion data details */}
    <Route
      path="/insertion_details/:insertionName"
      element={
        <PrivateRoute>
          <Insertion_details />
        </PrivateRoute>
      }
    />
    <Route
      path=""
      element={
        <PrivateRoute>
          <Insertion_details />
        </PrivateRoute>
      }
    />
          {/* <Route path="/campaign_details/" element={<Campaign_details />} /> */}
          {/* <Route path="/logout" element={<Login />} /> */}
          <Route path="*" element={<Navigate to="/login" />} />
          {/* <Route path="/test" element={<Dashboard_t/>}/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
