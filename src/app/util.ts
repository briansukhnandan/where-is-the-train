/** 
 * Takes in a list of elements and divides them into 
 * 2 sub-lists where one list passes a condition and the
 * other doesn't.
 */
export const partition = <T>(elems: T[], condition: (elem: T) => boolean) => {
  const validElems: T[] = [];
  const invalidElems: T[] = [];
  for (const elem of elems) {
    const listToPushTo = condition(elem)
      ? validElems
      : invalidElems;
    listToPushTo.push(elem);
  }
  return [validElems, invalidElems];
}
