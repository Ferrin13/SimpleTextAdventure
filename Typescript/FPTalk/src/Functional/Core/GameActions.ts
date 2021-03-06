import { DungeonActions } from './../Models/EntityActions';
import { PlayerActions } from './PlayerActions';
import { logAfterDelay, asyncReduce } from './../Utility';
import { combatVictory, CombatResult, combatDefeat, isVictory, isDefeat, isRetreat } from './../Models/GameEvents';
import { Dungeon, NPC, Player } from "../Models/Entities";
import { fightEnemy } from '../Combat/CombatActions';
import { Delay } from '../../Shared/Utility';

export type DungeonCombatResult = CombatResult & {
  dungeon: Dungeon
}

export const traverseDungeon = async (player: Player, dungeon: Dungeon): Promise<CombatResult> => {
  await logAfterDelay(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}.\n`, Delay.STANDARD);

  const minionCombatResult = await fightMinions(player, dungeon);
  switch(true) {
    case isVictory(minionCombatResult): return await fightBoss(player, minionCombatResult.dungeon);
    case isDefeat(minionCombatResult): return await onDefeat(minionCombatResult);
    case isRetreat(minionCombatResult): return await onRetreat(player, minionCombatResult.dungeon);
    default: throw new Error("Invalid combat result in traverse dunegon")
  }
}

const fightMinions = async (player: Player, dungeon: Dungeon): Promise<DungeonCombatResult> => {
  if(dungeon.minions.length === 0) return {...combatVictory(player), dungeon};

  const combatResult = await fightEnemy(player, dungeon.minions[0]);
  if(isVictory(combatResult)) {
    return fightMinions(combatResult.player, DungeonActions.removeNextMinion(dungeon))
  }
  
  return {...combatResult, dungeon}
}

const onDefeat = async (combatResult: CombatResult): Promise<CombatResult> => {
  await logAfterDelay(`You died\n`, Delay.STANDARD);
  return combatResult;
}

const onRetreat = async (player: Player, dungeon: Dungeon): Promise<CombatResult> => {
  await logAfterDelay(`You retreat to regather your strength...`, Delay.STANDARD);
  await logAfterDelay(`You finish regathering your strenth and are ready to continue\n`, Delay.VERY_LONG);
  const newPlayer = PlayerActions.setHealth(player, player.maxHealth);
  return traverseDungeon(newPlayer, dungeon)
}

const fightBoss = async (player: Player, dungeon: Dungeon): Promise<CombatResult> => {
  await logAfterDelay(`You have reached ${dungeon.boss.name!}!!!`, Delay.LONG);
  await logAfterDelay(`He has ${dungeon.boss.health} health and does ${dungeon.boss.baseAttackDamage} damage per attack!`, Delay.STANDARD);
  return fightEnemy(player, dungeon.boss).then(async result => {
    if(isRetreat(result)) {
      await logAfterDelay(`${dungeon.boss.name} leaps and stabs you in the back as you turn to run!!!`, Delay.LONG)
    }
    const dungeonCompletionMessage = `${isVictory(result) ? 'You have survied' : 'You have been defeated in'} ${dungeon.name}!\n`;
    await logAfterDelay(dungeonCompletionMessage, Delay.LONG);
    return result;
  })
}

