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
      const minion = this.minions.pop(); //Eventual bug
      combatResult = await this.fightMinion(minion);
      if(!combatResult.playerVictory) break;
    }
    return combatResult;
  }

  private async fightMinion(minion: NPC): Promise<CombatResult> {
    let combatResult: CombatResult;
    const combatEngagement = new CombatEngagement(this.player, minion)
    const minionCombatResult = await combatEngagement.initiate();
    if(minionCombatResult.playerVictory) {
      combatResult = STANDARD_COMBAT_VICTORY;
      this.defeatedMinions.push(minion);
    } else {
      combatResult = STANDARD_COMBAT_DEFEAT;
    }

    return combatResult;
  }
}