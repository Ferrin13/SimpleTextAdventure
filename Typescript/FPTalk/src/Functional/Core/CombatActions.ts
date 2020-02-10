import { PlayerActions } from './../Models/PlayerActions';
import { NPC, Weapon, Item, Player, isWeapon } from './../Models/Entities';
import { logAfterDelay, createPrompt, NO_RESULT_TYPE, NO_RESULT, isNoResult } from './../Utility';
import { CombatResult, STANDARD_COMBAT_VICTORY } from '../Models/GameEvents';
import { DEFAULT_LOG_WAIT } from '../../Imperative/Utility';

export const fightEnemy = async (player: Player, npc: NPC): Promise<CombatResult> => {
  await logAfterDelay(`You initiate combat with ${npc.name} (Health: ${npc.health}, Attack Damage: ${npc.attackDamage})`, DEFAULT_LOG_WAIT);
  return combatRound(npc, player)
}

const combatRound = async (npc: NPC, player: Player): Promise<CombatResult> => 
  createPrompt('Choose a weapon or item to use\n').then(async input => {
    const action = inputHandler(input, player);
    console.log(`Action is: ${JSON.stringify(action)}`)
    if(isInvalidInput(action)) {
      console.log(`${input} is not in your inventory, your inventory currently is:`)
      PlayerActions.printInventory(player);
      return combatRound(npc, player)
    }
    await logAfterDelay(`You slay ${npc.name}`, DEFAULT_LOG_WAIT);
    return STANDARD_COMBAT_VICTORY
  })


enum CombatActionType {
  ATTACK,
  ITEM_USE
}

interface CombatAttack {
  actionType: CombatActionType.ATTACK,
  weapon: Weapon
}

interface CombatItemUse {
  actionType: CombatActionType.ITEM_USE,
  item: Item
}

type CombatAction = CombatAttack | CombatItemUse;
const inputHandler = (playerInput: string, player: Player) : CombatAction | INVALID_INPUT_TYPE => {
  const normalizedInput = playerInput.toLocaleLowerCase();
  const actionEntity = getActionEntity(normalizedInput, player);
  if(isNoResult(actionEntity)) return INVALID_INPUT

  return combatActionCreator(actionEntity)
}

type ActionEntity = Weapon | Item;
const getActionEntity = (normalizedInput: string, player: Player): ActionEntity | NO_RESULT_TYPE => {
  const weapon = matchEntityByName(normalizedInput, player.inventoryWeapons)
  if(weapon) return weapon;

  const item = matchEntityByName(normalizedInput, player.inventoryItems)
  if(item) return item;

  return NO_RESULT
}

const matchEntityByName = <T extends {name: string}>(normalizedInput: string, entities: T[]): T | NO_RESULT_TYPE => {
  const entity = entities.find(w => w.name === normalizedInput)
  return entity ?? NO_RESULT;
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
  (input as INVALID_INPUT_TYPE).symbol !== INVALID_INPUT_SYMBOL;