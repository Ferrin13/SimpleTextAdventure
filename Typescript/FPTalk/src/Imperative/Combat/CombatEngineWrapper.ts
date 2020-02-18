import { isNpc } from './../Models/Entities';
import { CombatCapable} from './../../Functional/Models/Entities';
import { Player } from '../Models/Player';
import { Player as FunctionalPlayer } from '../../Functional/Models/Entities';
import { NPC as FunctionalNPC } from '../../Functional/Models/Entities';
import { Weapon, NPC, isPlayer, ICombatCapable } from '../Models/Entities';
import { AttackOutcome } from '../../Functional/Combat/CombatTypes';
import { getAttackEffects } from '../../Functional/Combat/CombatEngine';
import { NOTHING_TYPE } from '../../Shared/Utility';

export interface WrappedAttackEffects<TAttacker extends ICombatCapable, TDefender extends ICombatCapable> {
  attackOutcome: AttackOutcome,
  attackerChange: (attacker: TAttacker) => void,
  defenderChange: (defender: TDefender) => void
}

export const playerAttackEffects = (
  attacker: Player,
  defender: NPC,
  weapon: Weapon | NOTHING_TYPE): WrappedAttackEffects<Player, NPC> => {
    const convertedAttacker = playerToObject(attacker);
    const convertedDefender = npcToObject(defender);
    const attackEffects = getAttackEffects(convertedAttacker, convertedDefender, weapon);
    return {
      attackOutcome: attackEffects.attackOutcome,
      attackerChange: translateEffectToPlayer(attackEffects.attackerChange),
      defenderChange: translateEffectToNPC(attackEffects.defenderChange)
    }
}

export const npcAttackEffects = (
  attacker: NPC,
  defender: Player,
  weapon: Weapon | NOTHING_TYPE): WrappedAttackEffects<NPC, Player> => {
    const convertedAttacker = npcToObject(attacker);
    const convertedDefender = playerToObject(defender);
    const attackEffects = getAttackEffects(convertedAttacker, convertedDefender, weapon);
    return {
      attackOutcome: attackEffects.attackOutcome,
      attackerChange: translateEffectToNPC(attackEffects.attackerChange),
      defenderChange: translateEffectToPlayer(attackEffects.defenderChange)
    }
}

const playerToObject = (player: Player): FunctionalPlayer => ({
  name: player.getName(),
  health: player.getHealth(),
  maxHealth: player.getMaxHealth(),
  baseAttackDamage: player.getBaseAttackDamage(),
  inventoryWeapons: player.getWeapons(),
  inventoryItems: player.getItems()
})

const npcToObject = (npc: NPC): FunctionalNPC => ({
  name: npc.getName(),
  species: npc.getSpecies(),
  health: npc.getHealth(),
  baseAttackDamage: npc.getBaseAttackDamage(),
})

const translateEffectToPlayer = ( effect: ((functionalPlayer: FunctionalPlayer) => FunctionalPlayer)): (player: Player) => void => {
  return (player: Player) => {
    const functionalPlayer = playerToObject(player);
    const modifiedPlayer = effect(functionalPlayer);

    player.setName(modifiedPlayer.name);
    player.setHealth(modifiedPlayer.health);
    player.setMaxHealth(modifiedPlayer.maxHealth)
    player.setBaseAttackDamage(modifiedPlayer.baseAttackDamage);
    player.setItems(modifiedPlayer.inventoryItems);
    player.setWeapons(modifiedPlayer.inventoryWeapons);
  }
}

const translateEffectToNPC = ( effect: ((functionalPlayer: FunctionalNPC) => FunctionalNPC)): (npc: NPC) => void => {
  return (npc: NPC) => {
    const functionalNPC = npcToObject(npc);
    const modifiedPlayer = effect(functionalNPC);

    npc.setName(modifiedPlayer.name);
    npc.setHealth(modifiedPlayer.health);
    npc.setBaseAttackDamage(modifiedPlayer.baseAttackDamage);
  }
}

export enum CombatRoundState {
  PLAYER_DEFEATED,
  NPC_DEFEATED,
  BOTH_DEFEATED,
  NEITHER_DEFEATED
}
