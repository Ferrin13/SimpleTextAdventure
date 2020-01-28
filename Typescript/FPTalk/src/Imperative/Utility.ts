import * as readline from 'readline';

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
