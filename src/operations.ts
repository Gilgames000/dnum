import type { Decimals, Dnum, Numberish } from "./types";

import {
  equalizeDecimals,
  from,
  isDnum,
  setDecimals,
  setValueDecimals,
} from "./dnum";
import { divideAndRound } from "./utils";

export function add(
  num1: Numberish,
  num2: Numberish,
  decimals?: Decimals,
): Dnum {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2, decimals);
  return setDecimals(
    [num1_[0] + num2_[0], num1_[1]],
    decimals ?? (isDnum(num1) ? num1[1] : num1_[1]),
  );
}

export function subtract(
  num1: Numberish,
  num2: Numberish,
  decimals?: Decimals,
): Dnum {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2, decimals);
  return setDecimals(
    [num1_[0] - num2_[0], num1_[1]],
    decimals ?? (isDnum(num1) ? num1[1] : num1_[1]),
  );
}

export function multiply(
  num1: Numberish,
  num2: Numberish,
  decimals?: Decimals,
): Dnum {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2, decimals);
  return setDecimals(
    [num1_[0] * num2_[0], num1_[1] * 2],
    decimals ?? (isDnum(num1) ? num1[1] : num1_[1]),
  );
}

export function divide(
  num1: Numberish,
  num2: Numberish,
  decimals?: Decimals,
): Dnum {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2, decimals);
  if (num2_[0] === BigInt(0)) {
    throw new Error("Dnum: division by zero");
  }
  const value1 = setValueDecimals(num1_[0], Math.max(num1_[1], decimals ?? 0));
  const value2 = setValueDecimals(num2_[0], 0);
  return setDecimals(
    [divideAndRound(value1, value2), num1_[1]],
    decimals ?? (isDnum(num1) ? num1[1] : num1_[1]),
  );
}

export function remainder(
  num1: Numberish,
  num2: Numberish,
  decimals?: Decimals,
): Dnum {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return setDecimals(
    [num1_[0] % num2_[0], num1_[1]],
    decimals ?? (isDnum(num1) ? num1[1] : num1_[1]),
  );
}

export function compare(num1: Numberish, num2: Numberish): 1 | -1 | 0 {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return num1_ > num2_ ? 1 : num1_ < num2_ ? -1 : 0;
}

export function equal(num1: Numberish, num2: Numberish): boolean {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return num1_[0] === num2_[0];
}

export function greaterThan(num1: Numberish, num2: Numberish): boolean {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return num1_[0] > num2_[0];
}

export function lessThan(num1: Numberish, num2: Numberish): boolean {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return num1_[0] < num2_[0];
}

export function greaterThanOrEqual(num1: Numberish, num2: Numberish): boolean {
  const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
  return num1_[0] >= num2_[0];
}

export function lessThanOrEqual(num1: Numberish, num2: Numberish): boolean {
    const [num1_, num2_] = normalizePairAndDecimals(num1, num2);
    return num1_[0] <= num2_[0];
}

export function abs(num: Numberish, decimals?: Decimals): Dnum {
  const [valueIn, decimalsIn] = from(num);
  if (decimals === undefined) { decimals = decimalsIn; }

  let valueAbs = valueIn;
  if (valueAbs < BigInt(0)) {
    valueAbs = -valueAbs;
  }

  return setDecimals([valueAbs, decimalsIn], decimals);
}

export function floor(num: Numberish, decimals?: Decimals): Dnum {
  const [valueIn, decimalsIn] = from(num);
  if (decimals === undefined) { decimals = decimalsIn; }

  let whole = BigInt(String(valueIn).slice(0, -decimalsIn));
  const fraction = BigInt(String(valueIn).slice(-decimalsIn));
  if (whole < BigInt(0) && fraction > BigInt(0)) {
    whole -= BigInt(1);
  }
  const numFloored: Dnum = [
    BigInt(String(whole) + "0".repeat(decimalsIn)),
    decimalsIn,
  ];

  return setDecimals(numFloored, decimals);
}

export function ceil(num: Numberish, decimals?: Decimals): Dnum {
  const minus1: Dnum = [BigInt(-1), 0];
  return multiply(floor(multiply(num, minus1)), minus1, decimals);
}

export function round(num: Numberish, decimals?: Decimals): Dnum {
  const numIn = from(num);
  return setDecimals(
    setDecimals(numIn, 0), // setDecimals() uses divideAndRound() internally
    decimals === undefined ? numIn[1] : decimals,
  );
}

// Converts a pair of Numberish into Dnum and equalize
// their decimals based on the highest precision found.
function normalizePairAndDecimals(
  num1: Numberish,
  num2: Numberish,
  decimals?: number,
) {
  if (!decimals) decimals = 18;

  const num1_ = from(num1);
  const num2_ = from(num2);

  if (num1_[1] < 0 || num2_[1] < 0) {
    throw new Error("Dnum: decimals cannot be negative");
  }

  return equalizeDecimals(
    [num1_, num2_],
    Math.max(num1_[1], num2_[1], decimals ?? 0),
  );
}
