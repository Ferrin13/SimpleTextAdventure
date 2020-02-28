interface Array<T> {
  flat(): Array<T>;
  flatMap(func: (x: T) => T[]): Array<T>;
}

const input = ["String1", "String2", "String3"];

//Filter
let result1 = [];
for(let i = 0; i < input.length; i++) {
  if(input[i] == 'PickMe') {
    result1.push(input[i])
  }
}
const filterResult = input.filter(i => i == 'PickMe');

//Map
let result2 = [];
for(let i = 0; i < input.length; i++) {
  result2.push(input[i].toLocaleLowerCase())
}
const mapResult = input.map(i => i.toLocaleLowerCase());

//FlatMap
let result3 = [];
for(let i = 0; i < input.length; i++) {
  const chars = input[i].split('');
  for(let j = 0; j < chars.length; j++) {
    result3.push(chars[j])
  }
}
const flatMapResult = input.flatMap(i => i.split(''));

//Reduce
let result4 = '';
for(let i = 0; i < input.length; i++) {
  result4 += input[i].charAt(1);
}
const reduceResult = input.reduce((acc, cur) => acc + cur.charAt(1), '')