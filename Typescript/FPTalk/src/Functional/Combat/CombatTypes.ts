import { CombatCapable } from './../Models/Entities';
import { Weapon, Item, Player, NPC } from "../Models/Entities";

export enum CombatActionType {
  ATTACK,
  ITEM_USE
}

export const isCombatAttack = <T>(target: T | CombatAttack): target is CombatAttack => //TODO Generics necessary?
  (target as CombatAttack).actionType === CombatActionType.ATTACK
export interface CombatAttack {
  actionType: CombatActionType.ATTACK,
  weapon: Weapon
}

export const isCombatItemUse = <T>(target: T | CombatItemUse): target is CombatItemUse => //TODO Generics necessary?
  (target as CombatItemUse).actionType === CombatActionType.ITEM_USE
export interface CombatItemUse {
  actionType: CombatActionType.ITEM_USE,
  item: Item
}

export interface CombatRoundEffects {
  playerChange: (player: Player) => Player
  npcChange: (npc: NPC) => NPC
}

export enum CombatRoundState {
  ATTACKER_DEFEATED,
  DEFENDER_DEFEATED,
  BOTH_DEFEATED,
  NEITHER_DEFEATED
}

export interface CombatRoundOutcome<TAttacker extends CombatCapable = CombatCapable, TDefender extends CombatCapable = CombatCapable> {
  attacker: TAttacker,
  defender: TDefender,
  roundState: CombatRoundState
}

export enum AttackOutcome {
  HIT,
  DODGED,
  CRITICAL
}

export interface AttackEffects<TAttacker extends CombatCapable, TDefender extends CombatCapable> {
  attackOutcome: AttackOutcome,
  attackerChange: (attacker: TAttacker) => TAttacker,
  defenderChange: (defender: TDefender) => TDefender
}