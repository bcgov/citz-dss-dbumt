/**
 * Given a date, check if the date has past, or if it is within 10 days from today.
 *
 * @param expiryDate - The date to check against today
 * @returns An object containing two boolean values:
 * - isWarning: true if the date is within 10 days from today
 * - isPast: true if the date is in the past
 */
export const DateWarning = (expiryDate: Date) => {
  const today = new Date();
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return {
    isWarning: daysDiff > 0 && daysDiff <= 10,
    isPast: daysDiff <= 0,
  };
};
