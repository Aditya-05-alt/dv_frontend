import React from "react";

export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
      {message}
    </p>
  );
}
