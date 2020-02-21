import { isVictory, CombatOutcome } from './../../Functional/Models/GameEvents';
import { MinionCombat } from './MinionCombat';
import { pluralize, createPrompt } from '../Utility';
import { STANDARD_COMBAT_DEFEAT, STANDARD_COMBAT_VICTORY, CombatResult, DungeonResult } from '../Models/GameEvents';
import { Dungeon, NPC } from "../Models/Entities";
import { logAfterDelay } from "../Utility";
import { Player } from '../Models/Player';
import { CombatEngagement } from './CombatEngagement';
import { Delay } from '../../Shared/Utility';

export class DungeonTraverser {
  player: Player;
  dungeon: Dungeon;

  constructor(player: Player, dungeon: Dungeon) {
    this.player = player;
    this.dungeon = dungeon;
  }

  async traverse(): Promise<DungeonResult> {
    let retryMinions = true;
    let minionCombatResult: CombatResult;
    while(retryMinions) {
      await this.displayDungeonInformation();

      const minionCombat = new MinionCombat(this.player, this.dungeon.minions);
      minionCombatResult = await minionCombat.fightMinions();

      switch(minionCombatResult.combatOutcome) {
        case CombatOutcome.VICTORY: 
          await logAfterDelay(`You defeated ${pluralize(minionCombat.getDefeatedMinions().length, 'minion')} and have now reached ${this.dungeon.boss.getName()}!\n`, Delay.LONG);
          retryMinions = false;
          break;
        case CombatOutcome.DEFEAT:
          await logAfterDelay(`You were defeated in ${this.dungeon.name}!`, Delay.LONG);
          retryMinions = false
          break;
        default:
          await logAfterDelay(`You retreat to regather your strength...`, Delay.STANDARD);
          await logAfterDelay(`You finish regathering your strenth and are ready to continue\n`, Delay.VERY_LONG);
          this.player.setHealth(this.player.getMaxHealth())
      }
    }
    if(minionCombatResult.combatOutcome === CombatOutcome.DEFEAT) {
      return new DungeonResult(
        minionCombatResult,
        false
      )
    }
    
    await logAfterDelay(`You have reached ${this.dungeon.boss.getName()!}!!!`, Delay.LONG);
    await logAfterDelay(`He has ${this.dungeon.boss.getHealth()} health and does ${this.dungeon.boss.getBaseAttackDamage()} damage per attack!`, Delay.STANDARD);
    const bossEngagement = new CombatEngagement(this.player, this.dungeon.boss);
    const bossFightResult = await bossEngagement.initiate();
    await this.printDungeonOutcome(bossFightResult);

    return new DungeonResult(
      bossFightResult,
      false
    )
  }

  private async printDungeonOutcome(combatResult: CombatResult): Promise<void> {
    switch(combatResult.combatOutcome) {
      case CombatOutcome.VICTORY: 
        await logAfterDelay(`You have survied ${this.dungeon.name}!\n`, Delay.STANDARD);
        break;
      case CombatOutcome.RETREAT: 
        await logAfterDelay(`${this.dungeon.boss.getName()} leaps and stabs you in the back as you turn to run!!!`, Delay.LONG);
      case CombatOutcome.DEFEAT: 
        await logAfterDelay(`You have have been defeated in ${this.dungeon.name}!\n`, Delay.STANDARD);
        break;
      default: throw new Error("Invalid combat outcome in DungeonTraverser")
    }
  }

  private async displayDungeonInformation(): Promise<void> {
    await logAfterDelay(`You have entered the fearsome ${this.dungeon.boss.getName()!}'s ${this.dungeon.name}!\n`, Delay.STANDARD);
  }
}







