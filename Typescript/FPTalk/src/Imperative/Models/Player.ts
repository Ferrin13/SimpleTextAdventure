import { CombatEngagement } from './../Core/CombatEngagement';
import { CombatResult } from './GameEvents';
import { Item, Weapon, NPC } from "./Entities";
import { logAfterDelay } from "../../Functional/Utility";
import { DEFAULT_LOG_WAIT, createPrompt } from "../Utility";

export class Player {
  private name: string;
  private health: number;
  private maxHealth: number;
  private items: Item[];
  private weapons: Weapon[];

  constructor(name: string, health: number, maxHealth: number) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.items = [];
    this.weapons = [];
  }

  getName() {
    return this.name;
  }

  getHealth() {
    return this.health;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  getItems(): Item[] {
    return this.items;
  }

  addItems(...items: Item[]) {
    this.items.push(...items);
  }

  getWeapons(): Weapon[] {
    return this.weapons;
  }

  addWeapons(...weapons: Weapon[]) {
    this.weapons.push(...weapons);
  }

  async printInventory(): Promise<void> {
    await logAfterDelay('Weapons:', 200);
    for(let i = 0; i < this.getWeapons().length; i++) {
      await logAfterDelay(`\t${this.getWeapons()[i].name}`, 100);
    } 
    await logAfterDelay('Items:', 200);
    for(let i = 0; i < this.getItems().length; i++) {
      await logAfterDelay(`\t${this.getItems()[i].name}`, 100);
    }
  }

  async initiateCombat(npc: NPC): Promise<CombatResult> {
    await logAfterDelay(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.attackDamage})`, DEFAULT_LOG_WAIT);
    const combatEngagement = new CombatEngagement(this, npc);
    return combatEngagement.initiate();
  }
}