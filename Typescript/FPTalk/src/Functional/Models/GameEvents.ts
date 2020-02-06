export interface CombatResult {
  playerVictory: boolean;
  weaponsGained?: string[];
  weaponsLost?: string[];
}

export const STANDARD_COMBAT_VICTORY = {
  playerVictory: true
}

export const STANDARD_COMBAT_DEFEAT = {
  playerVictory: false
}