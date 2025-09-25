export function formatFsDate(value) {
  // Handles Firestore Timestamp, ISO string, or empty
  if (!value) return "";
  // Firestore Timestamp has seconds
  if (value.seconds) {
    const dt = new Date(value.seconds * 1000);
    return dt.toLocaleDateString("en-US");
  }
  // ISO or Date
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US");
}

export function toFixedOrDash(num, digits = 2) {
  const n = parseFloat(num);
  if (Number.isNaN(n)) return "-";
  return n.toFixed(digits);
}
