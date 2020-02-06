import { Dungeon } from './Entities';
export class CombatResult {
  playerVictory: boolean;
  weaponsGained: string[];
  weaponsLost: string[];

  constructor(playerVictory: boolean, weaponsGained?: string[], weaponsLost?: string[]) {
    this.playerVictory = playerVictory;
    this.weaponsGained = weaponsGained ?? [];
    this.weaponsLost = weaponsLost ?? [];
  }
}

export class DungeonResult extends CombatResult {
  bossKilled: boolean;
  constructor(combatResult: CombatResult, bossKilled: boolean) {
    super(combatResult.playerVictory, combatResult.weaponsGained, combatResult.weaponsLost)
    this.bossKilled = bossKilled;
  }
}

export const STANDARD_COMBAT_VICTORY = new CombatResult(true);
export const STANDARD_COMBAT_DEFEAT = new CombatResult(false);