import { CombatOutcome } from './../../Functional/Models/GameEvents';
import { Player } from "../Models/Player";
import { NPC } from "../Models/Entities";
import { CombatEngagement } from "./CombatEngagement";
import { CombatResult, STANDARD_COMBAT_VICTORY, STANDARD_COMBAT_DEFEAT } from "../Models/GameEvents";

export class MinionCombat {
  private player: Player;
  private minions: NPC[];
  private defeatedMinions: NPC[];
  constructor(player: Player, minions: NPC[]) {
    this.player = player;
    this.minions = minions;
    this.defeatedMinions = [];
  }

  getRemainingMinions(): NPC[] {
    return this.minions;
  }

  getDefeatedMinions(): NPC[] {
    return this.defeatedMinions;
  }

  async fightMinions(): Promise<CombatResult> {
    let combatResult = STANDARD_COMBAT_VICTORY; 
    while(this.minions.length > 0) {
      const minion = this.minions.shift(); //Eventual bug
      combatResult = await this.fightMinion(minion);
      if(!(combatResult.combatOutcome === CombatOutcome.VICTORY)) break;
    }
    return combatResult;
  }

  private async fightMinion(minion: NPC): Promise<CombatResult> {
    const combatEngagement = new CombatEngagement(this.player, minion)
    const minionCombatResult = await combatEngagement.initiate();
    if(minionCombatResult.combatOutcome === CombatOutcome.VICTORY) {
      this.defeatedMinions.push(minion);
    }

    return minionCombatResult;
  }
}