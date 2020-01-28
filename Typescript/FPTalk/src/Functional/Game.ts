import { EXAMPLE_DUNGEONS } from './Immutability';
import { Dungeon } from './GameObjects';
import { createPrompt, asyncForEach } from './Utility';

const traverseDungeon = async (dungeon: Dungeon): Promise<void> => {
  console.log(`You have entered the fearsome ${dungeon.name}...`);
  console.log(`You encounter the mighty boss ${dungeon.boss.name!}!!!`);
  console.log(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`);
  return createPrompt('Press any key to continue\n', input => console.log(`Input was: ${input}`));
}

async function executeGame(): Promise<void> {
  await asyncForEach(EXAMPLE_DUNGEONS, async dungeon => await traverseDungeon(dungeon));
}

executeGame();
