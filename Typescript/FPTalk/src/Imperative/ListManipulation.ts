import { DifficultyLevel } from "./Models/Types";
import { NPC } from "./Models/Entities";

// //Base data
// interface User {
//   name: string;
//   id: number;
//   age: number;
//   favoriteColors: string[];
// }
// const myList: User[] = [
//   {name: 'Andrew', id: 1, age: 40, favoriteColors: []},
//   {name: 'Bob', id: 2, age: 30, favoriteColors: ['Blue', 'Beige']},
//   {name: 'Carl', id: 3, age: 35, favoriteColors: ['Coral', 'Creme']},
//   {name: 'Dan', id: 4, age: 45, favoriteColors: ['Dark Green']},
// ];

// //Filter
// function getUnderFortyProcedural(userList: User[]): User[] {
//   const result: User[] = [];
//   for (let i = 0; i < userList.length; i++) {
//     if (userList[i].age < 40) {
//       result.push(userList[i]);
//     }
//   }
//   return result;
// }
// function geTunderFortyFunctional(userList: User[]): User[] {
//   return userList.filter(user => user.age < 40);
// }

// //Map
// function getAllIdsProcedural(userList: User[]): number[] {
//   const result: number[] = [];
//   for (let i = 0; i < userList.length; i++) {
//     result.push(myList[i].id);
//   }
//   return result;
// }
// function getAllIdsFunctional(userList: User[]): number[] {
//   return userList.map(user => user.id);
// }

// //FlatMap
// function getAllFavoriteColorsProcedural(userList: User[]): string[] {
//   const result: string[] = [];
//   for (let i = 0; i < userList.length; i++) {
//     for (let j = 0; j < userList[i].favoriteColors.length; j++) {
//       result.push(userList[i].favoriteColors[j]);
//     }
//   }
//   return result;
// }
// function getAllFavoriteColorsFunctional(userList: User[]): string[] {
//   return userList.flatMap(user => user.favoriteColors); //Import flat map implementation
// }


// const test = (x: (_: number) => string)

const POSSIBLE_MINION_NAMES = ['Minion1', 'Minion2', 'Minion3', 'Minion4'];
const POSSIBLE_MINION_SPECIES = ['Human', 'Orc', 'Spider', 'Dog'];
const EASY_MINION_HEALTH = 10;
const EASY_MINION_DAMAGE = 2;
const HARD_MINION_HEALTH = 150;
const HARD_MINION_DAMAGE = 15;

const TEMP_DIFFICULTY_CENTERPOINT = 5;

export function getRandomMinionsWithDifficulty(difficulties: DifficultyLevel[]): NPC[] {
  let result = [];
  for(let i = 0; i < difficulties.length; i++) {
    const difficulty = difficulties[i];
    const minion = new NPC(
      getRandomListElement(POSSIBLE_MINION_NAMES),
      getRandomListElement(POSSIBLE_MINION_SPECIES),
      minionHealthByDifficulty(difficulty),
      minionDamageByDifficulty(difficulty)
    )
    result.push(minion);
  }
  return result;
}

function getRandomListElement<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function minionHealthByDifficulty(difficulty: DifficultyLevel): number {
  return difficulty < TEMP_DIFFICULTY_CENTERPOINT ? EASY_MINION_HEALTH : HARD_MINION_HEALTH;
}

function minionDamageByDifficulty(difficulty: DifficultyLevel): number {
  return difficulty < TEMP_DIFFICULTY_CENTERPOINT ? EASY_MINION_DAMAGE : HARD_MINION_DAMAGE;
}