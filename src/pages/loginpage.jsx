import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import DVlogo from "../assets/DVlogo.png";
import AuthLayout from "../components/auth/AuthLayout";
import AuthLogoPanel from "../components/auth/AuthLogoPanel";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      left={<AuthLogoPanel src={DVlogo} alt="DV Logo" />}
      right={
        <AuthCard
          title="Welcome Back"
          subtitle="Please sign in to continue"
          footer={
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Sign up
              </Link>
            </p>
          }
        >
          <LoginForm
            auth={auth}
            onSuccess={() => {
              navigate("/dashboard");
            }}
          />
        </AuthCard>
      }
    />
  );
}
