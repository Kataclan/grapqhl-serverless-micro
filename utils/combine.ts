export default (items: any[], numSubItems: number): any[] => {
  const result = [];
  const indexes = new Array(numSubItems);
  for (let i = 0; i < numSubItems; i++) {
    indexes[i] = i;
  }
  while (indexes[0] < items.length - numSubItems + 1) {
    const v = [];
    for (let i = 0; i < numSubItems; i++) {
      v.push(items[indexes[i]]);
    }
    result.push(v);
    indexes[numSubItems - 1]++;
    let l = numSubItems - 1; // reference always is the last position at beginning
    while (
      indexes[numSubItems - 1] >= items.length &&
      indexes[0] < items.length - numSubItems + 1
    ) {
      l--; // the last position is reached
      indexes[l]++;
      for (let i = l + 1; i < numSubItems; i++) {
        indexes[i] = indexes[l] + (i - l);
      }
    }
  }
  return result;
};
