import { PlayerActions } from './Core/PlayerActions';
import { STARTING_PLAYER, BASIC_SWORD, BASIC_HEALTH_POTION, BASIC_WAND } from './Core/PlayerDefaults';
import { Dungeon, Player } from './Models/Entities';
import { EXAMPLE_DUNGEONS } from './Dungeons';
import { asyncReduce, logAfterDelay, compose } from './Utility';
import { traverseDungeon } from './Core/GameActions';
import { combatVictory, isVictory } from './Models/GameEvents';
import { Delay } from '../Shared/Utility';

const playerWithWeapons = PlayerActions.addWeapon(
  PlayerActions.addWeapon(STARTING_PLAYER, BASIC_SWORD),
  BASIC_WAND
)
const player = PlayerActions.addItem(
  playerWithWeapons,
  BASIC_HEALTH_POTION
)
// const setupPlayer = compose(PlayerActions.curriedAddItem(BASIC_SWORD), PlayerActions.curriedAddItem(BASIC_HEALTH_POTION));
// const player = setupPlayer(STARTING_PLAYER);

const dungeons = EXAMPLE_DUNGEONS;

async function executeGame(player: Player, dungeons: Dungeon[]): Promise<void> {
  await logAfterDelay("Your adventure begins...", Delay.VERY_SHORT);

  const finalResult = await asyncReduce(
    dungeons,
    async (prevResult, dungeon) => isVictory(prevResult) ? await traverseDungeon(prevResult.player, dungeon) : Promise.resolve(prevResult),
    combatVictory(player)
  )
  const finalMessage = isVictory(finalResult) ? 
    `Congratulations, you have conquered ${dungeons.length} dungeons and won the game!` :
    `You have failed, try again next time. Or don't, current data suggestes you'll fail again.`
  await logAfterDelay(finalMessage, Delay.LONG);
}

executeGame(player, dungeons);
