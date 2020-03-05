export {};

const input = ["Frodo", "Sam", "Gandalf", "Aragorn", "Galadriel"];

let result = [];
for(let i = 0; i < input.length; i++) {
  const chars = input[i].split('');
  for(let j = 0; j < chars.length; j++) {
    result.push(chars[j])
  }
}
console.log(`Procedural result: ${JSON.stringify(result)}`);

const flatMapResult = input.flatMap(i => i.split(''));
console.log(`Functional result: ${JSON.stringify(flatMapResult)}`);