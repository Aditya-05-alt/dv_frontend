import React from "react";

export default function AuthLayout({ left, right }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-blue-500">
        {left}
      </div>
      <div className="flex items-center justify-center p-8">
        {right}
      </div>
    </div>
  );
}
