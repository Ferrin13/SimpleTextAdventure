import { Player } from "../Models/Entities";

export const STARTING_PLAYER: Player = {
  name: "Ferrin",
  health: 100,
  maxHealth: 100,
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
      damage: 10
    }
  ]
}