import { NOTHING, NOTHING_TYPE, isNothing } from './../Utility';
import { Weapon } from './../../Imperative/Models/Entities';
import { AttackEffects, AttackOutcome } from './CombatTypes';
import { CombatCapable } from './../Models/Entities';
const MAX_ARMOR = 100;
const MAX_ARMOR_DR = .8;
const CRIT_MULTIPLIER = 2;

const DEFAULT_ARMOR = 10; //TODO Replace with defender armor when that is added
const DEFAULT_CRIT_CHANCE = .25;
const DEFAULT_DODGE_CHANCE = .25;

export const getAttackEffects = <TAttacker extends CombatCapable, TDefedner extends CombatCapable>(
  attacker: TAttacker,
  defender: TDefedner,
  weapon: Weapon | NOTHING_TYPE): AttackEffects<TAttacker, TDefedner> => {
    const attackOutcome = getAttackOutcome(attacker, defender, weapon);
    switch(attackOutcome) {
      case AttackOutcome.DODGED: return handleDodge(attacker, defender);
      case AttackOutcome.CRITICAL: return handleCrit(attacker, defender, weapon);
      case AttackOutcome.HIT: return handleHit(attacker, defender, weapon);
    }
}

const handleDodge = <TAttacker extends CombatCapable, TDefender extends CombatCapable>(attacker: TAttacker, defender: TDefender): AttackEffects<TAttacker, TDefender>  => ({
  attackOutcome: AttackOutcome.DODGED,
  attackerChange: a => a,
  defenderChange: d => d
}) 

const handleCrit = <TAttacker extends CombatCapable, TDefender extends CombatCapable>(
  attacker: TAttacker, 
  defender: TDefender, 
  weapon: Weapon | NOTHING_TYPE): AttackEffects<TAttacker, TDefender>  => {
  const netAttackDamage = attackerCritNetDamage(attacker, defender, weapon);
  return {
    attackOutcome: AttackOutcome.CRITICAL,
    attackerChange: attacker => attacker,
    defenderChange: defender => ({
      ...defender,
      health: defender.health - netAttackDamage
    })
  }
} 

const handleHit = <TAttacker extends CombatCapable, TDefender extends CombatCapable>(
  attacker: TAttacker,
  defender: TDefender,
  weapon: Weapon | NOTHING_TYPE): AttackEffects<TAttacker, TDefender>  => {
  const netAttackDamage = attackerNormalNetDamage(attacker, defender, weapon);
  return {
    attackOutcome: AttackOutcome.HIT,
    attackerChange: attacker => attacker,
    defenderChange: defender => ({
      ...defender,
      health: defender.health - netAttackDamage
    })
  }
}

const attackerCritNetDamage = (attacker: CombatCapable, defender: CombatCapable, weapon: Weapon | NOTHING_TYPE) =>
  attackerNormalNetDamage(attacker, defender, weapon) * CRIT_MULTIPLIER;

const attackerNormalNetDamage = (attacker: CombatCapable, defender: CombatCapable, weapon: Weapon | NOTHING_TYPE) =>
  attackerTotalDamage(attacker, weapon) * (1 - armorDamageReduction(DEFAULT_ARMOR)) //TODO Replace with defender armor when that is added

const attackerTotalDamage = (attacker: CombatCapable, weapon: Weapon | NOTHING_TYPE) => {
  const weaponDamage = isNothing(weapon) ? 0 : weapon.damage;
  return attacker.baseAttackDamage + weaponDamage;
}

const armorDamageReduction = (armor: number): number =>
  (armor / MAX_ARMOR) * MAX_ARMOR_DR;

const getAttackAffect = <TAttacker extends CombatCapable, TDefender extends CombatCapable>(
  attackOutcome: AttackOutcome,
  attacker: TAttacker,
  defender: TDefender,
  weapon: Weapon | NOTHING_TYPE): AttackEffects<TAttacker, TDefender> => {
    switch(attackOutcome) {
      case AttackOutcome.DODGED: return 
    }
}

const getAttackOutcome = (attacker: CombatCapable, defender: CombatCapable, weapon: Weapon | NOTHING_TYPE) => {
  const rand = Math.random();
  const dodgeChance = getDodgeChance(defender);
  const critChance = getCritChance(attacker, weapon);
  return randNumToAttackOutcome(rand, dodgeChance, critChance)
}

//NOTE: Because crit chance is applied after dodges, this means that the crit chance percentage is unaffected by dodge chance
const randNumToAttackOutcome = (num: Number, dodgeChance: number, critChance: number): AttackOutcome => {
  switch (true) {
    case (num <= dodgeChance): return AttackOutcome.DODGED
    case (num <= critChance + dodgeChance): return AttackOutcome.CRITICAL
    default: return AttackOutcome.HIT
  }
}

const getCritChance = (attacker: CombatCapable, weapon: Weapon | NOTHING_TYPE) => {
  return DEFAULT_CRIT_CHANCE; //TODO Replace with calculation when added
}

const getDodgeChance = (defender: CombatCapable) => {
  return DEFAULT_DODGE_CHANCE; //TODO Replace with calculation when added
}




