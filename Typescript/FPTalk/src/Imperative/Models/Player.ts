import { CombatEngagement } from './../Core/CombatEngagement';
import { CombatResult } from './GameEvents';
import { Item, Weapon, NPC, ICombatCapable } from "./Entities";
import { logAfterDelay } from "../../Functional/Utility";
import { DEFAULT_LOG_WAIT, createPrompt } from "../Utility";

export class Player implements ICombatCapable {
  private name: string;
  private health: number;
  private maxHealth: number;
  private items: Item[];
  private weapons: Weapon[];
  private baseAttackDamage: number;

  constructor(name: string, health: number, maxHealth: number, baseAttackDamage: number) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.baseAttackDamage = baseAttackDamage;
    this.items = [];
    this.weapons = [];
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  getHealth() {
    return this.health;
  }

  setHealth(health: number) {
    this.health = health;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  setMaxHealth(maxHealth: number) {
    this.maxHealth = maxHealth;
  }

  getBaseAttackDamage() {
    return this.baseAttackDamage;
  }

  setBaseAttackDamage(baseAttackDamage: number) {
    this.baseAttackDamage = baseAttackDamage;
  }

  getItems(): Item[] {
    return this.items;
  }

  addItems(...items: Item[]) {
    this.items.push(...items);
  }

  setItems(items: Item[]) {
    this.items = items;
  }

  getWeapons(): Weapon[] {
    return this.weapons;
  }

  setWeapons(weapons: Weapon[]) {
    this.weapons = weapons;
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
    await logAfterDelay(`You initiate combat with ${npc.getName()} (Health: ${npc.getHealth()}, Attack Damage: ${npc.getBaseAttackDamage()})`, DEFAULT_LOG_WAIT);
    const combatEngagement = new CombatEngagement(this, npc);
    return combatEngagement.initiate();
  }
}