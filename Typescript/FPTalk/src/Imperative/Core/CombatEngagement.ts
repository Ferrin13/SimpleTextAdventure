import { CombatResult, STANDARD_COMBAT_VICTORY, STANDARD_COMBAT_DEFEAT } from '../Models/GameEvents';
import { NPC, Weapon, Item, isWeapon } from '../Models/Entities';
import { createPrompt, logAfterDelay, DEFAULT_LOG_WAIT, isNoResult, NO_RESULT_TYPE, NO_RESULT } from '../Utility';
import { Player } from '../Models/Player';

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

const INVALID_INPUT_SYMBOL = Symbol()
interface INVALID_INPUT_TYPE {
  symbol: typeof INVALID_INPUT_SYMBOL
}
const INVALID_INPUT: INVALID_INPUT_TYPE = {
  symbol: INVALID_INPUT_SYMBOL
}
const isInvalidInput = <T>(input: T | INVALID_INPUT_TYPE): input is INVALID_INPUT_TYPE =>
  (input as INVALID_INPUT_TYPE).symbol === INVALID_INPUT_SYMBOL;
type ActionEntity = Weapon | Item;
type CombatAction = CombatAttack | CombatItemUse;

export class CombatEngagement {
  player: Player;
  npc: NPC;
  constructor(player: Player, npc: NPC) {
    this.player = player;
    this.npc = npc;
  }

  initiate = async (): Promise<CombatResult> => {
    await logAfterDelay(`You initiate combat with ${this.npc.name} (Health: ${this.npc.health}, Attack Damage: ${this.npc.attackDamage})`, DEFAULT_LOG_WAIT);
    return this.combatRound()
  }

  private async combatRound(): Promise<CombatResult> {
    let inCombat = true;
    while(inCombat) {
      const input = await createPrompt('Choose a weapon or item to use\n')
      const action = this.inputHandler(input);
      if(isInvalidInput(action)) {
        console.log(`${input} is not in your inventory, your inventory currently is:`)
        await this.player.printInventory();
        continue;
      }
      inCombat = false;
    }
    await logAfterDelay(`You slay ${this.npc.name}`, DEFAULT_LOG_WAIT);
    return STANDARD_COMBAT_VICTORY
  }

  private inputHandler(playerInput: string) : CombatAction | INVALID_INPUT_TYPE  {
    const normalizedInput = playerInput.toLocaleLowerCase();
    const actionEntity = this.getActionEntity(normalizedInput);
    if(isNoResult(actionEntity)) return INVALID_INPUT

    return this.combatActionCreator(actionEntity)
  }
  
  private getActionEntity(normalizedInput: string): ActionEntity | NO_RESULT_TYPE {
    const weapon = this.matchEntityByName(normalizedInput, this.player.getWeapons())
    if(!isNoResult(weapon)) return weapon;

    const item = this.matchEntityByName(normalizedInput, this.player.getItems())
    if(!isNoResult(item)) return item;

    return NO_RESULT
  }

  private matchEntityByName<T extends {name: string}>(normalizedInput: string, entities: T[]): T | NO_RESULT_TYPE {
    const entity = entities.find(w => w.name.toLocaleLowerCase() === normalizedInput)
    return entity ?? NO_RESULT;
  }

  private combatActionCreator (entity: Weapon | Item): CombatAction {
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
}

