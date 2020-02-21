import { Player } from "./Player";
export const isPlayer = (target: Player | NPC): target is Player => {
  return !!((target as Player).getItems) //TODO May need to change if NPC is more complex
}

export const isNpc = (target: Player | NPC): target is NPC => {
  return !!((target as NPC).getSpecies) //TODO May need to change if Player becomes more complex
}
export class NPC implements ICombatCapable {
  private name: string;
  private species: string;
  private baseAttackDamage: number;
  private health: number;


  constructor(name: string, species: string, baseAttackDamage: number, health: number) {
    this.name = name;
    this.species = species;
    this.baseAttackDamage = baseAttackDamage;
    this.health = health;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getSpecies() {
    return this.species;
  }

  setSpecies(species: string) {
    this.species = species;
  }

  getBaseAttackDamage() {
    return this.baseAttackDamage;
  }

  setBaseAttackDamage(attackDamage: number): void {
    this.baseAttackDamage = attackDamage;
  }

  getHealth() {
    return this.health;
  }

  setHealth(health: number): void {
    this.health = health;
  }

  toString(): string {
    return `${this.name}, ${this.species}, ${this.baseAttackDamage}, ${this.health}`
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
  weaponType: WeaponType;
  hidden?: boolean;
  constructor(name: string, damage: number, weaponType: WeaponType) {
    this.name = name;
    this.damage = damage;
    this.weaponType = weaponType;
    this.hidden = false;
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

export interface ICombatCapable {
  getHealth(): number,
  getBaseAttackDamage(): number
}

export enum WeaponType {
  Physical,
  Magical
}