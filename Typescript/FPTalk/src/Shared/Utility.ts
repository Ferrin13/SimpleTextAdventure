export const Delay = {
  VERY_SHORT: 250,
  SHORT: 500,
  STANDARD: 1000,
  LONG: 2000,
  VERY_LONG: 4000,
}

const NOTHING_SYMBOL = Symbol()
export interface NOTHING_TYPE {
  symbol: typeof NOTHING_SYMBOL
}
export const NOTHING: NOTHING_TYPE = {
  symbol: NOTHING_SYMBOL
}

export const isNothing = <T>(target: T | NOTHING_TYPE): target is NOTHING_TYPE => {
  return (target as NOTHING_TYPE).symbol === NOTHING_SYMBOL
}

export const floatToString = (number: Number): string => number.toFixed(1);
