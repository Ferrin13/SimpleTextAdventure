import { logAfterDelay, asyncReduce } from './../Utility';
import { STANDARD_COMBAT_VICTORY } from './../Models/GameEvents';
import { Dungeon, NPC } from "../Models/Entities";
import { CombatResult } from "../Models/GameEvents";
import { createPrompt } from "../Utility";

const DEFAULT_LOG_WAIT = 1000;

export const traverseDungeon = async (dungeon: Dungeon): Promise<void> => {
  await logAfterDelay(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`, 500);
  await logAfterDelay(`You encounter... ${dungeon.boss.name!}!!!`, DEFAULT_LOG_WAIT);
  await logAfterDelay(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`, DEFAULT_LOG_WAIT);

  const combatResult = await asyncReduce(
    dungeon.minions,
    async (prevResult, npc) => prevResult.playerVictory ? await fightEnemy(npc) : Promise.resolve(prevResult),
    STANDARD_COMBAT_VICTORY
  )

  await logAfterDelay(`You defeated ${dungeon.minions.length} minions and have now reached ${dungeon.boss.name}!`, DEFAULT_LOG_WAIT);

  return fightEnemy(dungeon.boss).then(async result => {
    result.playerVictory ? 
    await logAfterDelay(`You have survied ${dungeon.name}!`, DEFAULT_LOG_WAIT) :
    await logAfterDelay(`You have been defeated in ${dungeon.name}`, DEFAULT_LOG_WAIT)
  })
}

export const fightEnemy = async (npc: NPC): Promise<CombatResult> => {
  await logAfterDelay(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.attackDamage})`, DEFAULT_LOG_WAIT);
  return createPrompt('Press enter to use forbidden magic\n').then(async _ => {
    await logAfterDelay(`"Avada Kedavra!"...`, 200);
    await logAfterDelay(`You slay ${npc.name}`, DEFAULT_LOG_WAIT);
    return STANDARD_COMBAT_VICTORY
  })
}
