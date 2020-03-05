export {};

const input = ["Frodo", "Sam", "Gandalf", "Aragorn", "Galadriel"];

let result = [];
for(let i = 0; i < input.length; i++) {
  result.push(input[i].toLocaleLowerCase())
}
console.log(`Procedural result: ${JSON.stringify(result)}`);

const mapResult = input.map(name => name.toLocaleLowerCase());
console.log(`Functional result: ${JSON.stringify(mapResult)}`);