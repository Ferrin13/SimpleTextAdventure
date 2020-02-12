import { Player } from "./Entities"

export interface CombatResult {
  playerVictory: boolean;
  player: Player
}

export const combatVictory = (player: Player): CombatResult => ({
  playerVictory: true,
  player
})

export const combatDefeat = (player: Player): CombatResult => ({
  playerVictory: false,
  player
})