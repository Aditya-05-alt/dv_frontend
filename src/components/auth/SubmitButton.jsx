import React from "react";

export default function SubmitButton({ children, loading, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`w-full text-white font-medium py-2 rounded-lg transition ${
        loading || disabled
          ? "bg-indigo-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {children}
    </button>
  );
}
