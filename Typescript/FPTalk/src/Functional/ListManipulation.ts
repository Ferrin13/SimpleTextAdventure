import { NPC } from "./Models/Entities";
import { DifficultyLevel } from "./Models/Types";

const POSSIBLE_MINION_NAMES = ['Minion1', 'Minion2', 'Minion3', 'Minion4'];
const POSSIBLE_MINION_SPECIES = ['Human', 'Orc', 'Spider', 'Dog'];
const EASY_MINION_HEALTH = 10;
const EASY_MINION_DAMAGE = 2;
const HARD_MINION_HEALTH = 150;
const HARD_MINION_DAMAGE = 15;

const TEMP_DIFFICULTY_CENTERPOINT = 5;

export function getRandomMinionsWithDifficulty(difficulties: DifficultyLevel[]): NPC[] {
  return difficulties.map(difficulty => ({
    name: getRandomListElement(POSSIBLE_MINION_NAMES),
    species: getRandomListElement(POSSIBLE_MINION_SPECIES),
    health: minionHealthByDifficulty(difficulty),
    attackDamage: minionDamageByDifficulty(difficulty)
  }))
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

