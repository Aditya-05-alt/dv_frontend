/**
 * Calculates the total number of days in a campaign, inclusive of start and end dates.
 */
export const calculateDaysDiff = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  let start, end;
  if (startDate.seconds) start = new Date(startDate.seconds * 1000);
  else start = new Date(startDate);
  if (endDate.seconds) end = new Date(endDate.seconds * 1000);
  else end = new Date(endDate);
  if (isNaN(start) || isNaN(end)) return 0;
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays + 1 : 0;
};

/**
 * Calculates how many days have passed since the start date, inclusive.
 */
export const daysPassed = (startDate) => {
  if (!startDate) return 0;
  let start;
  if (startDate.seconds) start = new Date(startDate.seconds * 1000);
  else start = new Date(startDate);
  if (isNaN(start)) return 0;
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today < start) return 0; // Campaign hasn't started

  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Add 1 to count the start day
};

/**
 * Calculates the expected daily spend based on the total budget and duration.
 */
export const calculateTargetDailySpend = (budget, startDate, endDate) => {
  const totalDays = calculateDaysDiff(startDate, endDate);
  const budgetNum = parseFloat(budget) || 0;
  if (totalDays <= 0 || budgetNum <= 0) return 0;
  return budgetNum / totalDays;
};

/**
 * Calculates the pacing percentage by comparing actual spend to expected spend.
 */
export const calculatePacing = (mediaCost, budget, startDate, endDate) => {
  const targetDailySpend = calculateTargetDailySpend(budget, startDate, endDate);
  const numDaysPassed = daysPassed(startDate);
  
  // The amount that *should have* been spent by today
  const expectedSpend = targetDailySpend * numDaysPassed;

  if (expectedSpend <= 0) return 0; // Avoid division by zero
  
  const actualSpend = parseFloat(mediaCost) || 0;
  
  return (actualSpend / expectedSpend) * 100;
};