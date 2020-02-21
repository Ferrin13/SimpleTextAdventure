import { Weapon, Item } from './../Models/Entities';
import { Player } from "../Models/Entities";
import { WeaponType } from "../Models/Enums";

export const STARTING_PLAYER: Player = {
  name: "Ferrin",
  health: 100,
  maxHealth: 100,
  baseAttackDamage: 10,
  inventoryWeapons: [
    {
      name: "Avada Kedavra",
      damage: 10000,
      weaponType: WeaponType.Magical,
      hidden: true
    }
  ],
  inventoryItems: []
}

export const BASIC_SWORD: Weapon = {
  name: 'Sword',
  damage: 10,
  weaponType: WeaponType.Physical,
};

export const BASIC_HEALTH_POTION: Item = {
  name: 'Health Potion',
  userEffect: (player: Player) => {
    const healthAfterPotion = player.health + 25;
    return {
      ...player,
      health: healthAfterPotion < player.maxHealth ? healthAfterPotion : player.maxHealth
    }
  }
}