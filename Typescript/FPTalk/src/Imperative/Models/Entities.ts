import { Player } from "./Player";

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
  minions: NPC[];

  constructor(name: string, difficulty: number, boss: NPC) {
    this.name = name;
    this.difficulty = difficulty;
    this.boss = boss;
    this.minions = [];
  }

  toString(): string {
    return `Name: ${name}\nDifficulty: ${this.difficulty}\nBoss:{}`
  }

  addMinions(minions: NPC[]) {
    this.minions.push(...minions);
  }
}

export const isWeapon = (entity: Weapon | Item): entity is Weapon =>  (entity as Weapon).damage !== undefined;
export class Weapon {
  name: string;
  damage: number;
  constructor(name: string, damage: number) {
    this.name = name;
    this.damage = damage;
  }
}

export class Item {
  name: string;
  playerEffect?: (player: Player) => Player;
  enemyEffect?: (npc: NPC) => NPC;

  constructor(name: string) {
    this.name = name;
  }
}