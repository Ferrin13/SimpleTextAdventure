export class NPC {
  name: string;
  species: string;
  attackDamage: number;
  health: number;


  constructor(name: string, species: string, attackDamage: number, health: number) {
    this.name = name;
    this.species = species;
    this.attackDamage = attackDamage;
    this.health = health;
  }

  setHealth(health: number): void {
    this.health = health;
  }

  setAttackDamage(attackDamage: number): void {
    this.attackDamage = attackDamage;
  }

  toString(): string {
    return `${this.name}, ${this.species}, ${this.attackDamage}, ${this.health}`
  }
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