import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import DVlogo from "../assets/DVlogo.png";
import AuthLayout from "../components/auth/AuthLayout";
import AuthLogoPanel from "../components/auth/AuthLogoPanel";
import AuthCard from "../components/auth/AuthCard";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      left={<AuthLogoPanel src={DVlogo} alt="DV Logo" />}
      right={
        <AuthCard
          title="Create Account"
          subtitle="Join us and get started"
          footer={
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Login
              </Link>
            </p>
          }
        >
          <SignupForm
            auth={auth}
            onSuccess={() => {
              // after successful signup, go to login (same 3s behavior you had is fine to keep here)
              setTimeout(() => navigate("/login"), 3000);
            }}
          />
        </AuthCard>
      }
    />
  );
}
