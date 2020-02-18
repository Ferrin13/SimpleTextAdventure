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
