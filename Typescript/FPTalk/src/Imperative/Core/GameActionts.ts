import { Dungeon } from "../Models/Entities";
import { createPrompt } from "../Utility";

export const traverseDungeon = async (dungeon: Dungeon): Promise<void> => {
  console.log(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`);
  console.log(`You encounter... ${dungeon.boss.name!}!!!`);
  console.log(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`)
  const res = await createPrompt('Press any key to continue\n');
  console.log(`Input was: ${res}`);
}
