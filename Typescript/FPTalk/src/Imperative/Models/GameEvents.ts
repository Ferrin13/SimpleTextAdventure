import { isRetreat } from './../../Functional/Models/GameEvents';
import { Dungeon } from './Entities';
export enum CombatOutcome {
  VICTORY,
  DEFEAT,
  RETREAT
} 
export class CombatResult {
  combatOutcome: CombatOutcome;
  weaponsGained: string[];
  weaponsLost: string[];

  constructor(combatOutcome: CombatOutcome, weaponsGained?: string[], weaponsLost?: string[]) {
    this.combatOutcome = combatOutcome;
    this.weaponsGained = weaponsGained ?? [];
    this.weaponsLost = weaponsLost ?? [];
  }

  // isVictory() {
  //   return this.combatOutcome === CombatOutcome.VICTORY
  // }
  // isDefeat() {
  //   return this.combatOutcome === CombatOutcome.DEFEAT
  // }
  // isRetreat() {
  //   return this.combatOutcome === CombatOutcome.RETREAT
  // }
}

export class DungeonResult extends CombatResult {
  bossKilled: boolean;
  constructor(combatResult: CombatResult, bossKilled: boolean) {
    super(combatResult.combatOutcome, combatResult.weaponsGained, combatResult.weaponsLost)
    this.bossKilled = bossKilled;
  }
}

export const STANDARD_COMBAT_VICTORY = new CombatResult(CombatOutcome.VICTORY);
export const STANDARD_COMBAT_DEFEAT = new CombatResult(CombatOutcome.DEFEAT);
export const COMBAT_RETREAT = new CombatResult(CombatOutcome.RETREAT);