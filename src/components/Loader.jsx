import React from "react";
export default function Loader({
  gifSrc,
  label = "Loading...",
  size = 32,
  className = "",
}) {
  const sizePx = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`flex justify-center items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {gifSrc ? (
        <img
          src={gifSrc}
          alt=""
          style={{ width: sizePx, height: sizePx }}
          className="object-contain"
        />
      ) : (
        <div
          style={{
            width: sizePx,
            height: sizePx,
            // border width scales with size; defaults to ~1/8 of size
            borderWidth:
              typeof size === "number"
                ? Math.max(2, Math.floor(size / 8))
                : 4,
          }}
          className="border-gray-300 border-t-transparent rounded-full animate-spin"
        />
      )}
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}
