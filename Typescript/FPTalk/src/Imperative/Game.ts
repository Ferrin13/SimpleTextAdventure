import { EXAMPLE_DUNGEONS } from './Immutability';
import { traverseDungeon } from './Core/GameActionts';


async function executeGame(): Promise<void> {
  for(let i = 0; i < EXAMPLE_DUNGEONS.length; i++) {
    await traverseDungeon(EXAMPLE_DUNGEONS[i]);
  }
}

executeGame();
