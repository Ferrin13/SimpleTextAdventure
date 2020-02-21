import { logAfterDelay} from './Utility';
import { BASIC_WEAPON } from './Core/PlayerRepository';
import { EXAMPLE_DUNGEONS } from './Dungeons';
import { Player } from './Models/Player';
import { DungeonTraverser } from './Core/DungeonTraverser';
import { BASIC_HEALTH_POTION } from '../Functional/Core/PlayerRepository';
import { CombatOutcome } from './Models/GameEvents';
import { Delay } from '../Shared/Utility';

const dungeons = EXAMPLE_DUNGEONS;
const player = new Player('Ferrin', 20, 100, 10);

async function executeGame(): Promise<void> {
  player.addWeapons(BASIC_WEAPON)
  player.addItems(BASIC_HEALTH_POTION)

  await logAfterDelay("Your adventure begins...", Delay.VERY_SHORT);

  for(let i = 0; i < dungeons.length; i++) {
    const dungeonTraverer = new DungeonTraverser(player, dungeons[i]);
    const dungeonResult = await dungeonTraverer.traverse();
    if(!(dungeonResult.combatOutcome === CombatOutcome.VICTORY)) {
      await logAfterDelay(`You have failed, try again next time. Or don't, current data suggestes you'll fail again.`, Delay.LONG)
      return;
    }
  }
  await logAfterDelay(`Congratulations, you have conquered ${dungeons.length} dungeons and won the game!`, Delay.LONG)
}

executeGame();
