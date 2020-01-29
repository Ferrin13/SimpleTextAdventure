import { logAfterDelay } from './../Utility';
import { STANDARD_COMBAT_VICTORY } from './../Models/GameEvents';
import { Dungeon, NPC } from "../Models/Entities";
import { CombatResult } from "../Models/GameEvents";
import { createPrompt } from "../Utility";

export const traverseDungeon = async (dungeon: Dungeon): Promise<void> => {
  console.log(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`);
  console.log(`You encounter... ${dungeon.boss.name!}!!!`);
  console.log(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`);
  return fightEnemy(dungeon.boss).then(result => {
    result.playerDefeated ? 
      console.log(`You have been defeated in ${dungeon.name}`) :
      console.log(`You have survied ${dungeon.name}!`) 
  })
}

export const fightEnemy = async (npc: NPC): Promise<CombatResult> => {
  console.log(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.attackDamage})`);
  return createPrompt('Press enter to use forbidden magic').then(async _ => {
    console.log(`"Avada Kedavra!"...`);
    await logAfterDelay(`You slay ${npc.name}`, 1000);
    return STANDARD_COMBAT_VICTORY
  })
}