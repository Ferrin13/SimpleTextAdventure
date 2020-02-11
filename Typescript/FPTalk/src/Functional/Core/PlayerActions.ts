import { asyncForEach } from '../Utility';
import { logAfterDelay } from "../Utility";
import { Player } from "../Models/Entities";

export class PlayerActions {
  static printInventory = async (player: Player): Promise<void> => {
    await logAfterDelay('Weapons:', 200);
    await asyncForEach(player.inventoryWeapons, w => logAfterDelay(`\t${w.name}`, 100));
    await logAfterDelay('Items:', 200);
    await asyncForEach(player.inventoryItems, i => logAfterDelay(`\t${i.name}`, 100));
  }
}