import { Player } from "../Models/Entities";
import { WeaponType } from "../Models/Enums";

export const STARTING_PLAYER: Player = {
  name: "Ferrin",
  health: 10,
  maxHealth: 100,
  baseAttackDamage: 10,
  inventoryItems: [
    {
      name: 'Health Potion',
      userEffect: (player: Player) => {
        const healthAfterPotion = player.health + 25;
        return {
          ...player,
          health: healthAfterPotion < player.maxHealth ? healthAfterPotion : player.maxHealth
        }
      }
    }
  ],
  inventoryWeapons: [
    {
      name: 'Sword',
      damage: 10,
      weaponType: WeaponType.Physical,
    },
    {
      name: "Avada Kedavra",
      damage: 10000,
      weaponType: WeaponType.Magical,
      hidden: true
    }
  ]
}