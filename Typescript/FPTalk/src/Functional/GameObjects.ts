// export class NPC {
//   name: string;
//   species: string;
//   attackDamage: number;
//   health: number;


//   constructor(name: string, species: string, attackDamage: number, health: number) {
//     this.name = name;
//     this.species = species;
//     this.attackDamage = attackDamage;
//     this.health = health;
//   }

//   setHealth = (newHealth: number): NPC => {
//     return {
//       ...this,
//       health: newHealth
//     }
//   }

//   setAttackDamage = (newAttackDamage: number): NPC => {
//     return {
//       ...this,
//       attackDamage: newAttackDamage
//     }
//   }
// }

export interface NPC {
  name: string;
  species: string;
  attackDamage: number;
  health: number;
}

export class NPCActions {
  static setHealth = (npc: NPC, newHealth: number): NPC => {
    return {
      ...npc,
      health: newHealth
    }
  }

  static setAttackDamage = (npc: NPC, newAttackDamage: number): NPC => {
    return {
      ...npc,
      attackDamage: newAttackDamage
    }
  }

  static currySetHealth = (newHealth: number) => (npc: NPC): NPC => {
    return {
      ...npc,
      health: newHealth
    }
  }

  static currySetAttackDamage = (newAttackDamage: number) => (npc: NPC): NPC => {
    return {
      ...npc,
      attackDamage: newAttackDamage
    }
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