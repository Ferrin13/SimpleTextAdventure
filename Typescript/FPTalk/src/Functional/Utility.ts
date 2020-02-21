import * as readline from 'readline';

export const createPrompt = async (promptText: string, delayMs: number = 0): Promise<string> => {
  await new Promise(resolve => setTimeout(() => resolve(), delayMs));

  const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => 
    readLineInterface.question(promptText, answer => {
      resolve(answer);
      readLineInterface.close();
    })
  )
}
export const asyncForEach = async <T>(array: T[], callbackfn: (value: T, index?: number, array?: T[]) => Promise<void>) => {
  for(let i = 0; i < array.length; i++) {
    await callbackfn(array[i], i, array)
  }
}

export const asyncReduce = async <T, R>(array: T[], callbackfn: (acc: R, value: T, index?: number, array?: T[]) => Promise<R>, initialValue: R): Promise<R> => {
  let accumulator = initialValue;
  for(let i = 0; i < array.length; i++) {
    accumulator = await callbackfn(accumulator, array[i], i, array);
  }
  return accumulator;
}

export const logAfterDelay = async (text: string, delayMs: number): Promise<void> => 
  new Promise(resolve => 
    setTimeout(() => {
      console.log(text);
      resolve();
    }, delayMs)
  );

export function compose<T, RIntermediate, R>(
  func1: (arg: RIntermediate) => R,
  func2: (arg: T) => RIntermediate
) : (arg: T) => R
export function compose<T, RIntermediate1, RIntermediate2, R>(
  func1: (arg: RIntermediate2) => R,
  func2: (arg: RIntermediate1) => RIntermediate2,
  func3: (arg: T) => RIntermediate1
) : (arg: T) => R
export function compose<T, RIntermediate1, RIntermediate2, RIntermediate3, R>(
  func1: (arg: RIntermediate3) => R,
  func2: (arg: RIntermediate2) => RIntermediate3,
  func3: (arg: RIntermediate1) => RIntermediate2,
  func4: (arg: T) => RIntermediate1
) : (arg: T) => R
export function compose(...funcs: ((arg: unknown) => unknown)[]): any {
  return (arg: unknown) => funcs.reduceRight((acc, current) => current(acc), arg)
}
