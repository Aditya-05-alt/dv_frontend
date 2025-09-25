import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  return (
    <div className={`${open ? "w-64" : "w-20"} bg-blue-500 text-white p-6 transition-all duration-300`}>
      <button className="text-white mb-6" onClick={() => setOpen(!open)}>
        {open ? <FaArrowLeft size={20} /> : <FaArrowRight size={20} />}
      </button>

      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="flex items-center space-x-4 py-2 hover:bg-blue-700 rounded-md">
            <FaHome size={20} />
            {open && <span>Home</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
}
