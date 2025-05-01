/**
 * Given an array of elements, join them into a string with a specified separator and a different separator for the last element.
 *
 * @param arr - Array of elements to be joined
 * @param separator - The string to separate each element (except the last) in the array
 * @param lastSeparator - The string to separate the last element in the array
 * @returns A string that joins the elements of the array with the specified separators
 */
export const JoinArrayWithLast = <T,>(
  arr: T[],
  separator: string,
  lastSeparator: string,
) => {
  // If the array is empty or has one element only use the last separator
  if (arr.length <= 1) {
    return arr.join(lastSeparator);
  }
  const allButLast = arr.slice(0, -1).join(separator);
  const last = arr[arr.length - 1];
  return `${allButLast}${lastSeparator}${last}`;
};
