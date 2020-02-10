import { logAfterDelay, asyncReduce } from './../Utility';
import { STANDARD_COMBAT_VICTORY } from './../Models/GameEvents';
import { Dungeon, NPC, Player } from "../Models/Entities";
import { DEFAULT_LOG_WAIT } from '../../Imperative/Utility';
import { fightEnemy } from './CombatActions';

export const traverseDungeon = async (player: Player, dungeon: Dungeon): Promise<void> => {
  await logAfterDelay(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`, 500);
  await logAfterDelay(`You encounter... ${dungeon.boss.name!}!!!`, DEFAULT_LOG_WAIT);
  await logAfterDelay(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`, DEFAULT_LOG_WAIT);

  const combatResult = await asyncReduce(
    dungeon.minions,
    async (prevResult, npc) => prevResult.playerVictory ? await fightEnemy(player, npc) : Promise.resolve(prevResult),
    STANDARD_COMBAT_VICTORY
  )

  await logAfterDelay(`You defeated ${dungeon.minions.length} minions and have now reached ${dungeon.boss.name}!`, DEFAULT_LOG_WAIT);

  return fightEnemy(player, dungeon.boss).then(async result => {
    result.playerVictory ? 
    await logAfterDelay(`You have survied ${dungeon.name}!`, DEFAULT_LOG_WAIT) :
    await logAfterDelay(`You have been defeated in ${dungeon.name}`, DEFAULT_LOG_WAIT)
  })
}


