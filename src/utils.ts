import { DraggableBounds } from "react-draggable";

export type GameGrid = (number | null)[][];

const WIDTH = 50;
const MARGIN = 8;
const STEP = WIDTH + 2 * MARGIN;

let sortedArr = Array(15)
  .fill(null)
  .map((_, idx) => idx + 1);

const findIndexes = (grid: GameGrid, target: number) => {
  let cIdx = -1;
  const rIdx = grid.findIndex((row) => {
    const elIdx = row.findIndex((item) => item === target);
    const found = elIdx !== -1;
    if (found) {
      cIdx = elIdx;
    }
    return found;
  });

  return { rIdx, cIdx };
};

const checkSequence = (array: number[]): boolean => {
  const sum =
    array
      .map((n, idx) => {
        let k = 0;
        for (let i = idx + 1; i < array.length; i++) {
          if (n > array[i]) k++;
        }
        return k;
      })
      .reduce((res, cur) => res + cur, 0) + 4;
  return sum % 2 === 0;
};

export const generateGrid = (withCheck: boolean) => {
  let { result, isSolvable } = generateSequence(withCheck);
  const grid = [];
  while (result.length > 0) {
    grid.push(result.splice(0, 4));
  }
  grid[grid.length - 1].push(null);
  return { result: grid, isSolvable };
};

const generateSequence = (onlySolvable: boolean): any => {
  let result = Array.from(sortedArr);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  const isSolvable = checkSequence(result);
  if (onlySolvable) {
    if (!isSolvable) {
      return generateSequence(true);
    }
  }

  return {
    result,
    isSolvable,
  };
};

export const getDraggableParams = (
  grid: GameGrid,
  rIdx: number,
  cIdx: number
): {
  axis: "x" | "y" | "none";
  bounds?: DraggableBounds;
} => {
  if (grid[rIdx][cIdx - 1] === null) {
    return { axis: "x", bounds: { left: -STEP, right: 0 } };
  }
  if (grid[rIdx][cIdx + 1] === null) {
    return { axis: "x", bounds: { left: 0, right: STEP } };
  }
  if (grid[rIdx - 1]?.[cIdx] === null) {
    return { axis: "y", bounds: { bottom: 0, top: -STEP } };
  }
  if (grid[rIdx + 1]?.[cIdx] === null) {
    return { axis: "y", bounds: { bottom: STEP, top: 0 } };
  }

  return { axis: "none" };
};

export const updateGrid = (
  grid: GameGrid,
  element: number,
  deltaX: number,
  deltaY: number
): GameGrid => {
  if (!(deltaX || deltaY)) {
    return grid;
  }
  const { rIdx, cIdx } = findIndexes(grid, element);
  const { axis } = getDraggableParams(grid, rIdx, cIdx);
  const newGrid = [...grid];
  if (axis === "x" && deltaX) {
    if (deltaX > 0) {
      newGrid[rIdx][cIdx + 1] = element;
    } else if (deltaX < 0) {
      newGrid[rIdx][cIdx - 1] = element;
    }
    newGrid[rIdx][cIdx] = null;
  } else if (axis === "y" && deltaY) {
    if (deltaY > 0) {
      newGrid[rIdx + 1][cIdx] = element;
    } else {
      newGrid[rIdx - 1][cIdx] = element;
    }
    newGrid[rIdx][cIdx] = null;
  } else {
    return grid;
  }

  return newGrid;
};
