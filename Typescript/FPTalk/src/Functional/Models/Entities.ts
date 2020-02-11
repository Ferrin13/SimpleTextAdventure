export interface Player {
  name: string;
  health: number;
  maxHealth: number;
  inventoryWeapons: Weapon[];
  inventoryItems: Item[]; 
}

export interface NPC {
  name: string;
  species: string;
  attackDamage: number;
  health: number;
}

export const isWeapon = (entity: Weapon | Item): entity is Weapon => (entity as Weapon).damage !== undefined;
export interface Weapon {
  name: string;
  damage: number;
}

export interface Item {
  name: string;
  playerEffect?: (player: Player) => Player;
  enemyEffect?: (npc: NPC) => NPC;
}

export class Dungeon {
  name: string;
  difficulty: number;
  minions: NPC[];
  boss: NPC;
}