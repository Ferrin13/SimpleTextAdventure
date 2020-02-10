import * as readline from 'readline';
export const DEFAULT_LOG_WAIT = 1000;

export const createPrompt = (promptText: string): Promise<string> => {
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

export const pluralize = (value: number, singularText: string, pluralText?: string): string => {
  const pluralForm = pluralText ?? `${singularText}s`;
  return `${value} ${value === 1 ? singularText : pluralForm}`
}


export const logAfterDelay = async (text: string, delayMs: number): Promise<void> => 
  new Promise(resolve => 
    setTimeout(() => {
      console.log(text);
      resolve();
    }, delayMs)
  );
