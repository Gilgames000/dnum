export function divideAndRound(dividend: bigint, divisor: bigint) {
  const invertSign = BigInt(dividend < BigInt(0) ? -1 : 1);
  return (dividend * invertSign + divisor / BigInt(2)) / divisor * invertSign;
}

export function splitNumber(number: string) {
  let [whole, fraction = "0"] = number.split(".");
  if (whole === "") {
    whole = "0";
  }

  // trim trailing zeros
  fraction = fraction.replace(/(?!^)0*$/, "");

  return [whole, fraction];
}

export function powerOfTen(zeroes: number) {
  // This is to avoid using the ** operator which
  // doesn’t seem to work for BigInt values on CodeSandbox.
  // See https://github.com/codesandbox/codesandbox-client/issues/6706
  return BigInt("1" + "0".repeat(zeroes));
}
