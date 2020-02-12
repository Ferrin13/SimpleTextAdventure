import { CombatCapable, isPlayer } from './../Models/Entities';
import { getAttackEffects } from './CombatEngine';
import { PlayerActions } from '../Core/PlayerActions';
import { NPC, Weapon, Item, Player, isWeapon } from '../Models/Entities';
import { logAfterDelay, createPrompt, NOTHING_TYPE, NOTHING, isNothing } from '../Utility';
import { CombatResult, combatVictory} from '../Models/GameEvents';
import { DEFAULT_LOG_WAIT } from '../../Imperative/Utility';
import { CombatActionType, CombatAttack, CombatItemUse, AttackEffects, CombatRoundOutcome, CombatRoundState, isCombatAttack, isCombatItemUse } from './CombatTypes';

export const fightEnemy = async (player: Player, npc: NPC): Promise<CombatResult> => {
  await logAfterDelay(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.baseAttackDamage})`, DEFAULT_LOG_WAIT);
  return combatRound(npc, player)
}

const combatRound = async (npc: NPC, player: Player): Promise<CombatResult> => 
  createPrompt('Choose a weapon or item to use\n').then(async input => {
    const action = inputHandler(input, player);
    if(isInvalidInput(action)) {
      console.log(`${input} is not in your inventory, your inventory currently is:`)
      PlayerActions.printInventory(player);
      return combatRound(npc, player)
    }
    const actionOutcome = executePlayerAction(player, action, npc);
    switch(actionOutcome.roundState) {
      case CombatRoundState.ATTACKER_DEFEATED: return onCombatDefeat(player, npc)
      case CombatRoundState.BOTH_DEFEATED: return onCombatDefeat(player, npc)
      case CombatRoundState.DEFENDER_DEFEATED: return onCombatVictory(player, npc)
      default: return combatRound(npc, player)
    }
  })

const executePlayerAction = (player: Player, action: CombatAction, target: NPC | Player): CombatRoundOutcome => {
  //Need !isPlayer for type narrowing (Also, can't use swtich(true) because type narrowing doesn't occur)
  if (isCombatAttack(action) && !isPlayer(target)) {
    return executePlayerAttack(player, action, target)
  } else if (isCombatItemUse(action)) {
    return executePlayerItemUse(player, action, target)
  }
  throw new Error(`Invalid combat action: ${JSON.stringify(action)}`)
}

const executePlayerAttack = (player: Player, action: CombatAttack, target: NPC): CombatRoundOutcome => {
  const attackEffects = getAttackEffects(player, target, action.weapon);
  const modifiedPlayer = attackEffects.attackerChange(player);
  const modifiedTarget = attackEffects.defenderChange(target);
  return {
    attacker: modifiedPlayer,
    defender: modifiedTarget,
    roundState: getRoundState(player, target)
  }
}

const getRoundState = (attacker: CombatCapable, defender: CombatCapable): CombatRoundState => {
  switch (true) {
    case attacker.health == 0 && defender.health == 0: return CombatRoundState.BOTH_DEFEATED
    case attacker.health == 0: return CombatRoundState.ATTACKER_DEFEATED
    case defender.health == 0: return CombatRoundState.DEFENDER_DEFEATED
    default: return CombatRoundState.NEITHER_DEFEATED
  }
}

const executePlayerItemUse = (player: Player, action: CombatItemUse, target: NPC | Player): CombatRoundOutcome => {
  console.log("Your item is ineffectual");
  return {
    attacker: player,
    defender: target,
    roundState: CombatRoundState.NEITHER_DEFEATED
  }
}

const onCombatVictory = async (player: Player, enemy: NPC, victoryInfo?: string): Promise<CombatResult> => {
  await logAfterDelay(`You slay ${enemy.name}`, 200);
  return combatVictory(player);
}

const onCombatDefeat = async (player: Player, enemy: NPC, victoryInfo?: string): Promise<CombatResult> => {
  await logAfterDelay(`You are defeated by ${enemy.name}`, 200);
  return combatDefeat(player);
}

type CombatAction = CombatAttack | CombatItemUse;
const inputHandler = (playerInput: string, player: Player) : CombatAction | INVALID_INPUT_TYPE => {
  const normalizedInput = playerInput.toLocaleLowerCase();
  const actionEntity = getActionEntity(normalizedInput, player);
  if(isNothing(actionEntity)) return INVALID_INPUT

  return combatActionCreator(actionEntity)
}

type ActionEntity = Weapon | Item;
const getActionEntity = (normalizedInput: string, player: Player): ActionEntity | NOTHING_TYPE => {
  const weapon = matchEntityByName(normalizedInput, player.inventoryWeapons)
  if(!isNothing(weapon)) return weapon;

  const item = matchEntityByName(normalizedInput, player.inventoryItems)
  if(!isNothing(item)) return item;

  return NOTHING
}

const matchEntityByName = <T extends {name: string}>(normalizedInput: string, entities: T[]): T | NOTHING_TYPE => {
  const entity = entities.find(w => w.name.toLocaleLowerCase() === normalizedInput)
  return entity ?? NOTHING;
}

const combatActionCreator = (entity: Weapon | Item): CombatAction => {
  if(isWeapon(entity)) {
    return {
      actionType: CombatActionType.ATTACK,
      weapon: entity
    }
  } else {
    return {
      actionType: CombatActionType.ITEM_USE,
      item: entity
    }
  }
}

const INVALID_INPUT_SYMBOL = Symbol()
interface INVALID_INPUT_TYPE {
  symbol: typeof INVALID_INPUT_SYMBOL
}
const INVALID_INPUT: INVALID_INPUT_TYPE = {
  symbol: INVALID_INPUT_SYMBOL
}
const isInvalidInput = <T>(input: T | INVALID_INPUT_TYPE): input is INVALID_INPUT_TYPE =>
  (input as INVALID_INPUT_TYPE).symbol === INVALID_INPUT_SYMBOL;