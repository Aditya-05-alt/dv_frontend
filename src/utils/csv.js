export function toCsv(headers, rows) {
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const headerLine = headers.map(escape).join(",");
  const body = rows.map((r) => r.map(escape).join(",")).join("\n");
  return `${headerLine}\n${body}`;
}
