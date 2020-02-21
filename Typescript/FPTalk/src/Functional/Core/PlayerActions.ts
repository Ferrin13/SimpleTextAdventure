import { Item, Weapon } from './../Models/Entities';
import { asyncForEach } from '../Utility';
import { logAfterDelay } from "../Utility";
import { Player } from "../Models/Entities";

export class PlayerActions {
  static printInventory = async (player: Player): Promise<void> => {
    await logAfterDelay('Weapons:', 200);
    await asyncForEach(player.inventoryWeapons.filter(w => !(w.hidden ?? false)), w => logAfterDelay(`\t${w.name}`, 100));
    await logAfterDelay('Items:', 200);
    await asyncForEach(player.inventoryItems, i => logAfterDelay(`\t${i.name}`, 100));
  }

  static setHealth = (player: Player, newHealth: number): Player => {
    return {
      ...player,
      health: newHealth
    }
  }

  static addItem = (player: Player, item: Item): Player => {
    return {
      ...player,
      inventoryItems: [...player.inventoryItems, item]
    }
  }

  static addWeapon = (player: Player, weapon: Weapon): Player => {
    return {
      ...player,
      inventoryWeapons: [...player.inventoryWeapons, weapon]
    }
  }

  static curriedAddItem = (item: Item) => (player: Player): Player => 
    PlayerActions.addItem(player, item)

  static curriedAddWeapon = (weapon: Weapon) => (player: Player): Player => 
    PlayerActions.addWeapon(player, weapon)
}