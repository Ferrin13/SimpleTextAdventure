import { MinionCombat } from './MinionCombat';
import { pluralize, createPrompt } from '../Utility';
import { STANDARD_COMBAT_DEFEAT, STANDARD_COMBAT_VICTORY, CombatResult, DungeonResult } from '../Models/GameEvents';
import { Dungeon, NPC } from "../Models/Entities";
import { logAfterDelay } from "../Utility";
import { Player } from '../Models/Player';
import { CombatEngagement } from './CombatEngagement';
const DEFAULT_LOG_WAIT = 1000;

export class DungeonTraverser {
  player: Player;
  dungeon: Dungeon;

  constructor(player: Player, dungeon: Dungeon) {
    this.player = player;
    this.dungeon = dungeon;
  }

  async traverse(): Promise<DungeonResult> {
    await this.displayDungeonInformation();

    const minionCombat = new MinionCombat(this.player, this.dungeon.minions);
    const minionCombatResult = await minionCombat.fightMinions();

    if(minionCombatResult.playerVictory) {
      await logAfterDelay(`You defeated ${pluralize(minionCombat.getDefeatedMinions().length, 'minion')} and have now reached ${this.dungeon.boss.getName()}!`, DEFAULT_LOG_WAIT);
    } else {
      await logAfterDelay(`You were defeated in ${this.dungeon.name}!`, DEFAULT_LOG_WAIT);
      await logAfterDelay(`You defeated ${pluralize(minionCombat.getDefeatedMinions().length, 'minion')}, ${this.dungeon.minions.length} remain`, DEFAULT_LOG_WAIT);
      return new DungeonResult(
        minionCombatResult,
        false
      )
    }
  
    const bossEngagement = new CombatEngagement(this.player, this.dungeon.boss);
    const bossFightResult = await bossEngagement.initiate();
    return new DungeonResult(
      bossFightResult,
      false
    )
  }

  private async displayDungeonInformation(): Promise<void> {
    await logAfterDelay(`You have entered the fearsome ${this.dungeon.boss.getName()!}'s ${this.dungeon.name}...`, 500);
    await logAfterDelay(`It's boss is ${this.dungeon.boss.getName()!}!!!`, DEFAULT_LOG_WAIT);
    await logAfterDelay(`He has ${this.dungeon.boss.getHealth()} health and does ${this.dungeon.boss.getBaseAttackDamage()} damage per attack!`, DEFAULT_LOG_WAIT);
  }
}







