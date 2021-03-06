import { Item, Weapon, WeaponType } from "../Models/Entities";
import { Player } from "../Models/Player";

export const DEFAULT_PLAYER = new Player('Ferrin', 50, 100, 10);
export const BASIC_HEALTH_POTION = new Item("Health Potion")
export const BASIC_SWORD = new Weapon('Sword', 10, WeaponType.Physical)
export const BASIC_WAND = new Weapon('Wand', 10, WeaponType.Magical)