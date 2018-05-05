export function moveInArray(array: any[], fromIndex: number, toIndex: number) {
  array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
}
