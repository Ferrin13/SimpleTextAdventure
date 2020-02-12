export const isPlayer = (target: Player | NPC): target is Player => {
  return !!((target as Player).inventoryItems) //TODO May need to change if NPC is more cimplex
}

export interface Player {
  name: string;
  health: number;
  maxHealth: number;
  baseAttackDamage: number;
  inventoryWeapons: Weapon[];
  inventoryItems: Item[]; 
}

export interface NPC {
  name: string;
  species: string;
  baseAttackDamage: number;
  health: number;
}

export interface CombatCapable {
  baseAttackDamage: number;
  health: number;
}

export const isWeapon = (entity: Weapon | Item): entity is Weapon => (entity as Weapon).damage !== undefined;
export interface Weapon {
  name: string;
  damage: number;
}

export interface Item {
  name: string;
  userEffect?: (player: Player) => Player;
  targetEffect?: (npc: NPC) => NPC;
}

export class Dungeon {
  name: string;
  difficulty: number;
  minions: NPC[];
  boss: NPC;
}