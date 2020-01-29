import { EXAMPLE_DUNGEONS } from './Immutability';
import { asyncForEach } from './Utility';
import { traverseDungeon } from './Core/GameActions';

async function executeGame(): Promise<void> {
  await asyncForEach(EXAMPLE_DUNGEONS, async dungeon => await traverseDungeon(dungeon));
}

executeGame();
