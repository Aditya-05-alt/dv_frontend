import React from "react";

export default function TopBar({ logoSrc, avatarSrc, email, onLogout, onAvatarClick, dropdownOpen }) {
  return (
    <div className="bg-blue-700 text-white p-6 flex justify-between items-center shadow-md w-full sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <img src={logoSrc} alt="Logo" className="w-10 h-10" />
        <h1 className="text-xl font-semibold">DV 360</h1>
      </div>

      <div className="relative flex items-center space-x-3">
        <img
          src={avatarSrc}
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
          onClick={onAvatarClick}
        />
        <span className="text-sm">{email || "User"}</span>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-10">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
