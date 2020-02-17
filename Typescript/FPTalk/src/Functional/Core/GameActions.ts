import { logAfterDelay, asyncReduce } from './../Utility';
import { combatVictory } from './../Models/GameEvents';
import { Dungeon, NPC, Player } from "../Models/Entities";
import { DEFAULT_LOG_WAIT } from '../../Imperative/Utility';
import { fightEnemy } from '../Combat/CombatActions';

export const traverseDungeon = async (player: Player, dungeon: Dungeon): Promise<void> => {
  await logAfterDelay(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`, 500);
  await logAfterDelay(`${dungeon.boss.name} has ${dungeon.boss.health} health and does ${dungeon.boss.baseAttackDamage} damage per attack!`, DEFAULT_LOG_WAIT);

  const combatResult = await asyncReduce(
    dungeon.minions,
    async (prevResult, npc) => prevResult.playerVictory ? await fightEnemy(prevResult.player, npc) : Promise.resolve(prevResult),
    combatVictory(player)
  )
  if(!combatResult.playerVictory) {
    await logAfterDelay(`You died, better luck next time`, 1000);
    return;
  }
  await logAfterDelay(`You defeated ${dungeon.minions.length} minions and have now reached ${dungeon.boss.name}!`, DEFAULT_LOG_WAIT);

  return fightEnemy(player, dungeon.boss).then(async result => {
    result.playerVictory ? 
    await logAfterDelay(`You have survied ${dungeon.name}!`, DEFAULT_LOG_WAIT) :
    await logAfterDelay(`You have been defeated in ${dungeon.name}`, DEFAULT_LOG_WAIT)
  })
}


