export interface NPC {
  name: string;
  species: string;
  attackDamage: number;
  health: number;
}

export interface Weapon {
  name: string;
  damage: number;
}

export class Dungeon {
  name: string;
  difficulty: number;
  boss: NPC;

  constructor(name: string, difficulty: number, boss: NPC) {
    this.name = name;
    this.difficulty = difficulty;
    this.boss = boss;
  }

  toString(): string {
    return `Name: ${name}\nDifficulty: ${this.difficulty}\nBoss:{}`
  }
}