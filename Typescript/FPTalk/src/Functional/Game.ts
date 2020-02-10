import { STARTING_PLAYER } from './Core/PlayerRepository';
import { Dungeon, Player } from './Models/Entities';
import { EXAMPLE_DUNGEONS } from './Immutability';
import { asyncForEach } from './Utility';
import { traverseDungeon } from './Core/GameActions';

const player = STARTING_PLAYER;
const dungeons = EXAMPLE_DUNGEONS;

async function executeGame(player: Player, dungeons: Dungeon[]): Promise<void> {
  await asyncForEach(dungeons, async dungeon => await traverseDungeon(player, dungeon));
}

executeGame(player, dungeons);
