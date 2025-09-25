import React from "react";

export default function Pagination({ currentPage, totalPages, onPrev, onNext }) {
  const hide = totalPages <= 1;

  return (
    <div className="flex justify-between mt-4">
      {!hide ? (
        <>
          <button
            onClick={onPrev}
            disabled={currentPage <= 1}
            className={`px-4 py-2 rounded ${
              currentPage <= 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="flex items-center text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 rounded ${
              currentPage >= totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </>
      ) : (
        <div className="w-full text-right text-sm text-gray-600">Showing all results</div>
      )}
    </div>
  );
}
