import React from "react";

const VARIANT_STYLES = {
  error: "text-red-600 bg-red-50 border-red-200",
  success: "text-green-600 bg-green-50 border-green-200",
  info: "text-blue-600 bg-blue-50 border-blue-200",
};

export default function Alert({ message, variant = "info" }) {
  if (!message) return null;
  return (
    <p className={`text-sm border rounded px-3 py-2 ${VARIANT_STYLES[variant] || VARIANT_STYLES.info}`}>
      {message}
    </p>
  );
}
