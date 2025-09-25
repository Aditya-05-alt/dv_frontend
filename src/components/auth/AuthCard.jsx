import React from "react";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-md bg-white border rounded-xl shadow p-8 space-y-6">
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      {children}
      {footer}
    </div>
  );
}
