export {};

const input = ["Frodo", "Sam", "Gandalf", "Aragorn", "Galadriel"];

//Filter
let result = [];
for(let i = 0; i < input.length; i++) {
  var name = input[i];
  if(name.charAt(0) === 'G') {
    result.push(name)
  }
}
console.log(`Procedural result: ${JSON.stringify(result)}`);

const filterResult = input.filter(name => name.charAt(0) === 'G');
console.log(`Functional result: ${JSON.stringify(filterResult)}`);