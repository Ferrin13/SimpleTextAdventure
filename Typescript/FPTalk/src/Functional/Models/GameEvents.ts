import { Player } from "./Entities"

export enum CombatOutcome {
  VICTORY,
  DEFEAT,
  RETREAT
} 


export interface CombatResult {
  outcome: CombatOutcome;
  player: Player
}

export const isVictory = (result: CombatResult) => result.outcome === CombatOutcome.VICTORY
export const combatVictory = (player: Player): CombatResult => ({
  outcome: CombatOutcome.VICTORY,
  player
})

export const isDefeat = (result: CombatResult) => result.outcome === CombatOutcome.DEFEAT
export const combatDefeat = (player: Player): CombatResult => ({
  outcome: CombatOutcome.DEFEAT,
  player
})

export const isRetreat = (result: CombatResult) => result.outcome === CombatOutcome.RETREAT
export const combatRetreat = (player: Player): CombatResult => ({
  outcome: CombatOutcome.RETREAT,
  player
})