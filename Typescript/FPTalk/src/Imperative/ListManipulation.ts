import { DifficultyLevel } from "./Models/Types";
import { NPC } from "./Models/Entities";

const POSSIBLE_MINION_NAMES = ['Mal-Thau', 'Terthuk', 'Mor-Drang', 'Tar-Revar', 'Dremar', 'Porthan', 'Yulter',
 'Kediath', 'Nabstuk', 'Kadier', 'Pul-Venegoth', 'Barsook', 'Ketran', 'Hashverm', 'Narlok', 'Perath-Dol'];
const POSSIBLE_MINION_SPECIES = ['Human', 'Orc', 'Spider', 'Dog'];
const EASY_MINION_HEALTH = 10;
const EASY_MINION_DAMAGE = 5;
const HARD_MINION_HEALTH = 100;
const HARD_MINION_DAMAGE = 10;

const TEMP_DIFFICULTY_CENTERPOINT = 5;

export function getRandomMinionsWithDifficulty(difficulties: DifficultyLevel[]): NPC[] {
  let result = [];
  for(let i = 0; i < difficulties.length; i++) {
    const difficulty = difficulties[i];
    const minion = new NPC(
      getRandomListElement(POSSIBLE_MINION_NAMES),
      getRandomListElement(POSSIBLE_MINION_SPECIES),
      minionDamageByDifficulty(difficulty),
      minionHealthByDifficulty(difficulty)
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