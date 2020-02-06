import { pluralize } from './../Utility';
import { STANDARD_COMBAT_DEFEAT, STANDARD_COMBAT_VICTORY, CombatResult, DungeonResult } from './../Models/GameEvents';
import { Dungeon, NPC } from "../Models/Entities";
import { createPrompt, logAfterDelay } from "../Utility";
const DEFAULT_LOG_WAIT = 1000;

export const traverseDungeon = async (dungeon: Dungeon): Promise<DungeonResult> => {
  await logAfterDelay(`You have entered the fearsome ${dungeon.boss.name!}'s ${dungeon.name}...`, 500);
  await logAfterDelay(`You encounter... ${dungeon.boss.name!}!!!`, DEFAULT_LOG_WAIT);
  await logAfterDelay(`He has ${dungeon.boss.health} health and does ${dungeon.boss.attackDamage} damage per attack!`, DEFAULT_LOG_WAIT);

  let combatResult = STANDARD_COMBAT_VICTORY;
  let defeatedMinions: NPC[] = [];
  while(dungeon.minions.length > 0) {
    const minion = dungeon.minions.pop(); //Eventual bug
    const minionCombatResult = await fightEnemy(minion);
    if(minionCombatResult.playerVictory) {
      combatResult = STANDARD_COMBAT_VICTORY;
      defeatedMinions.push(minion);
    } else {
      combatResult = STANDARD_COMBAT_DEFEAT;
      break;
    }
  }

  if(!combatResult.playerVictory) {
    await logAfterDelay(`You were defeated in ${dungeon.name}!`, DEFAULT_LOG_WAIT);
    await logAfterDelay(`You defeated ${pluralize(defeatedMinions.length, 'minion')}, ${dungeon.minions.length} remain`, DEFAULT_LOG_WAIT);
    return new DungeonResult(
      combatResult,
      false
    )
  }

  await logAfterDelay(`You defeated ${pluralize(defeatedMinions.length, 'minion')} and have now reached ${dungeon.boss.name}!`, DEFAULT_LOG_WAIT);

  const bossFightResult = await fightEnemy(dungeon.boss);
  return new DungeonResult(
    bossFightResult,
    false
  )
}

export const fightEnemy = async (npc: NPC): Promise<CombatResult> => {
  await logAfterDelay(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.attackDamage})`, DEFAULT_LOG_WAIT);
  return createPrompt('Choose which weapon to attack with\n').then(async weapon => {
    if(weapon.toLocaleLowerCase() === 'magic') {
      await logAfterDelay(`"Avada Kedavra!"...`, 200);
      await logAfterDelay(`You slay ${npc.name}`, DEFAULT_LOG_WAIT);
      return STANDARD_COMBAT_VICTORY
    } else {
      await logAfterDelay(`Your attack profanes the very ground upon which you tread, ${npc.name} knocks you unconscious`, DEFAULT_LOG_WAIT);
      return STANDARD_COMBAT_DEFEAT
    }
  })
}