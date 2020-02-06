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
  minions: NPC[];
  boss: NPC;
}