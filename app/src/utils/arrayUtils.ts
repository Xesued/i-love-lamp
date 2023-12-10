/**
 * Removes an item from the array if found.
 *
 *
 * @param arr array
 * @param item the item to search for and remove
 * @returns new array
 */
export function arrayRemove<T>(arr: Array<T>, item?: T) {
  if (item === undefined) return arr
  let i = arr.findIndex((a) => a === item)
  if (i === -1) return arr
  return [...arr.slice(0, i), ...arr.slice(i + 1)]
}
