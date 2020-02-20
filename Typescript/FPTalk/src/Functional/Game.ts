import { STARTING_PLAYER } from './Core/PlayerRepository';
import { Dungeon, Player } from './Models/Entities';
import { EXAMPLE_DUNGEONS } from './Immutability';
import { asyncReduce, logAfterDelay } from './Utility';
import { traverseDungeon } from './Core/GameActions';
import { combatVictory, isVictory } from './Models/GameEvents';
import { DEFAULT_LOG_WAIT } from '../Shared/Utility';

const player = STARTING_PLAYER;
const dungeons = EXAMPLE_DUNGEONS;

async function executeGame(player: Player, dungeons: Dungeon[]): Promise<void> {
  const finalResult = await asyncReduce(
    dungeons,
    async (prevResult, dungeon) => isVictory(prevResult) ? await traverseDungeon(prevResult.player, dungeon) : Promise.resolve(prevResult),
    combatVictory(player)
  )
  const finalMessage = isVictory(finalResult) ? 
    `Congratulations, you have defated ${dungeons.length} and won the game!` :
    `You have failed, try again next time. Or don't, current data suggestes you'll fail again.`
  await logAfterDelay(finalMessage, DEFAULT_LOG_WAIT);
}

executeGame(player, dungeons);
