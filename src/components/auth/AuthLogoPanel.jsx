import React from "react";

export default function AuthLogoPanel({ src, alt = "Logo" }) {
  return <img src={src} alt={alt} className="max-w-xs w-2/3" />;
}
