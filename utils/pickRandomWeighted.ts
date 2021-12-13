export interface Weighted {
  weight: number; // Integer from 0 to 100
}

function checkWeights<T extends Weighted>(arr: T[]): boolean {
  let sum = 0;
  arr.forEach((obj) => {
    sum += obj.weight;
  });
  if (sum !== 100) return false;
  return true;
}

function createWeightsArray<T extends Weighted>(arr: T[]): T[] {
  const newArray: T[] = [];
  arr.map((weightedObj) => {
    for (let i = 0; i < weightedObj.weight; ++i) {
      newArray.push(weightedObj);
    }
  });
  return newArray;
}

export function pickRandomWeighted<T extends Weighted>(arr: T[]): T {
  if (!checkWeights(arr)) {
    throw new Error("Overall wheights needs to sum 100.");
  }
  const weighted = createWeightsArray(arr);
  return weighted[Math.floor(Math.random() * weighted.length)];
}
