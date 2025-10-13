export const remainingBudget = (budget,spent) =>{
    const budgetNum = parseFloat(budget) || 0;
    const spentNum = parseFloat(spent) || 0;
    const remain = budgetNum - spentNum;
    return remain;
};

export const remainingDays = (today, endDate) => {
  const toDate = (v) => {
    if (v instanceof Date) return v;
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  const t = toDate(today) || new Date(); // default to now when today is invalid/omitted
  const e = toDate(endDate);
  if (!e) return 0; // invalid endDate -> 0

  // normalize to midnight (UTC) to avoid timezone/DST partial-day issues
  const toMidnightUTC = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = toMidnightUTC(e) - toMidnightUTC(t);
  const days = Math.ceil(diffMs / 86400000); // ms per day

  return days > 0 ? days : 0; // remaining days (0 if endDate is today or past)
};




