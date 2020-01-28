import { createPrompt } from './Utility';
import { EXAMPLE_DUNGEONS } from './Immutability';
import { Dungeon } from './GameObjects';

const traverseDungeon = async (dungeon: Dungeon): Promise<void> => {
  console.log(`You have entered the fearsome ${dungeon.name}...`);
  console.log(`You encounter the mighty boss ${dungeon.boss.name!}!!!`)
  console.log(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`)
  const res = await createPrompt('Press any key to continue\n');
  console.log(`Input was: ${res}`);
}

async function executeGame(): Promise<void> {
  for(let i = 0; i < EXAMPLE_DUNGEONS.length; i++) {
    await traverseDungeon(EXAMPLE_DUNGEONS[i]);
  }
}

executeGame();
