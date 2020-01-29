export interface CombatResult {
  playerDefeated: boolean;
  weaponsGained?: string[];
  weaponsLost?: string[];
}

export const STANDARD_COMBAT_VICTORY = {
  playerDefeated: false
}

export const STANDARD_COMBAT_DEFEAT = {
  playerDefeated: true
}