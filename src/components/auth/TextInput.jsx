import React from "react";

export default function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  id,
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        placeholder={placeholder}
        autoComplete={type === "password" ? "current-password" : "email"}
      />
    </div>
  );
}
