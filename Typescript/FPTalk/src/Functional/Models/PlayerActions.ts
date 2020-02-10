import { asyncForEach } from './../Utility';
import { logAfterDelay } from "../Utility";
import { Player } from "./Entities";

export class PlayerActions {
  static printInventory = async (player: Player): Promise<void> => {
    await logAfterDelay('Weapons', 200);
    await asyncForEach(player.inventoryWeapons, w => logAfterDelay(w.name, 100));
    await logAfterDelay('Weapons', 200);
    await asyncForEach(player.inventoryItems, i => logAfterDelay(i.name, 100));
  }
}