export {}
const input = ["Frodo", "Sam", "Gandalf", "Aragorn", "Galadriel"];

let result = '';
for(let i = 0; i < input.length; i++) {
  result += input[i].charAt(1);
}
console.log(`Procedural result: ${JSON.stringify(result)}`);

const reduceResult = input.reduce((acc, cur) => acc + cur.charAt(1), '')
console.log(`Functional result: ${JSON.stringify(reduceResult)}`);