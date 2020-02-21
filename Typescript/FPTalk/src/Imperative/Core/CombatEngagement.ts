import { COMBAT_RETREAT } from './../Models/GameEvents';
import { NOTHING, Delay } from './../../Shared/Utility';
import { npcAttackEffects } from './../Combat/CombatEngineWrapper';
import { isCombatAttack, isCombatItemUse, AttackOutcome, BASIC_ATTACK } from './../../Functional/Combat/CombatTypes';
import { CombatResult, STANDARD_COMBAT_VICTORY, STANDARD_COMBAT_DEFEAT } from '../Models/GameEvents';
import { NPC, Weapon, Item, isWeapon } from '../Models/Entities';
import { createPrompt, logAfterDelay } from '../Utility';
import { Player } from '../Models/Player';
import { getAttackEffects } from '../../Functional/Combat/CombatEngine';
import { playerAttackEffects, CombatRoundState } from '../Combat/CombatEngineWrapper';
import { NOTHING_TYPE, isNothing, floatToString } from '../../Shared/Utility';

enum CombatActionType {
  ATTACK,
  ITEM_USE
}

interface CombatAttack {
  actionType: CombatActionType.ATTACK,
  weapon: Weapon | NOTHING_TYPE
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
  inCombat: boolean;

  constructor(player: Player, npc: NPC) {
    this.player = player;
    this.npc = npc;
    this.inCombat = false;
  }

  initiate = async (): Promise<CombatResult> => {
    if(!(await this.promptToEngage())) return COMBAT_RETREAT

    await logAfterDelay(`You initiate combat with ${this.npc.getName()} (Health: ${this.npc.getHealth()}, Attack Damage: ${this.npc.getBaseAttackDamage()})`, Delay.STANDARD);
    return this.combatRound()
  }

  private async promptToEngage(): Promise<boolean> {
    return await createPrompt(`You encounter ${this.npc.getName()}. The current combat situation is: ${this.playerAndNpcState()} \nDo you wish to attack or retreat?\n`, Delay.STANDARD).then(async input => {
      var result: boolean = null;
      while(result === null)
      switch(input.toLocaleLowerCase()) {
        case 'retreat': 
          result = false;
          break;
        case 'attack': 
          result = true;
          break;
        default:
          console.log("Please choose either 'Attack' or 'Retreat`\n");
      }
      return result;
    })
  }

  
  private playerAndNpcState(): string {
    return `${this.player.getName()}: (Health: ${floatToString(this.player.getHealth())}/${floatToString(this.player.getMaxHealth())})` +
      `, ${this.npc.getName()}: (Health: ${floatToString(this.npc.getHealth())})`
  }

  private async combatRound(): Promise<CombatResult> {
    this.inCombat = true;
    while(this.inCombat) {
      await this.printEngagementState();
      const input = await createPrompt('Choose a weapon or item to use\n', Delay.SHORT)
      const action = this.inputHandler(input);
      if(isInvalidInput(action)) {
        console.log(`${input} is not in your inventory, your inventory currently is:`)
        await this.player.printInventory();
        continue;
      }
      this.executePlayerAction(action)
      if(!this.shouldContinueCombat()) {
        this.inCombat = false;
      } else {
        this.executeNpcAttack(BASIC_ATTACK)
      }
      if(!this.shouldContinueCombat()) {
       this.inCombat = false;   
      }
    }
    return this.handleFinalCombatState();
  }

  private inputHandler(playerInput: string) : CombatAction | INVALID_INPUT_TYPE  {
    const normalizedInput = playerInput.toLocaleLowerCase();
    const actionEntity = this.getActionEntity(normalizedInput);
    if(isNothing(actionEntity)) return INVALID_INPUT

    return this.combatActionCreator(actionEntity)
  }
  
  private getActionEntity(normalizedInput: string): ActionEntity | NOTHING_TYPE {
    const weapon = this.matchEntityByName(normalizedInput, this.player.getWeapons())
    if(!isNothing(weapon)) return weapon;

    const item = this.matchEntityByName(normalizedInput, this.player.getItems())
    if(!isNothing(item)) return item;

    return NOTHING
  }

  private matchEntityByName<T extends {name: string}>(normalizedInput: string, entities: T[]): T | NOTHING_TYPE {
    const entity = entities.find(w => w.name.toLocaleLowerCase() === normalizedInput)
    return entity ?? NOTHING;
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

  private executePlayerAction(action: CombatAction) {
    //Can't use swtich(true) because type narrowing doesn't occur 
    if(isCombatAttack(action)) {
      this.executePlayerAttack(action);
    } else if(isCombatItemUse(action)) {
      console.log("NOT IMPLEMENTED");
    } else {
      throw new Error("Invalid action pased to execute player action ");
    }
  }

  private executePlayerAttack(attack: CombatAttack) {
    const attackEffects = playerAttackEffects(this.player, this.npc, attack.weapon);
    const previousNpcHealth = this.npc.getHealth();
    attackEffects.attackerChange(this.player);
    attackEffects.defenderChange(this.npc);
    const damageDone = previousNpcHealth - this.npc.getHealth();
    const attackMessage = this.attackOutcomeDescription(attackEffects.attackOutcome, attack.weapon, this.player.getName(), this.npc.getName(), damageDone);
    console.log(attackMessage);
  }

  private executeNpcAttack(attack: CombatAttack) {
    const attackEffects = npcAttackEffects(this.npc, this.player, attack.weapon);
    const previousPlayerHealth = this.player.getHealth();
    attackEffects.attackerChange(this.npc);
    attackEffects.defenderChange(this.player);
    const damageDone = previousPlayerHealth - this.player.getHealth();
    const attackMessage = this.attackOutcomeDescription(attackEffects.attackOutcome, attack.weapon, this.npc.getName(), this.player.getName(), damageDone);
    console.log(attackMessage);
  }

  private printEngagementState(): Promise<void> {
    return logAfterDelay(
      `\nCombat round started between ${this.player.getName()}: (Health: ${floatToString(this.player.getHealth())}/${floatToString(this.player.getMaxHealth())}) ` +
      `and ${this.npc.getName()}: (Health: ${floatToString(this.npc.getHealth())})`, Delay.STANDARD);
  }

  private attackOutcomeDescription (attackOutcome: AttackOutcome, weapon: Weapon | NOTHING_TYPE, attackerName: string, defenderName: string, damage: number): string {
    switch (attackOutcome) {
      case (AttackOutcome.CRITICAL): return `${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name} critically strikes for ${floatToString(damage)} damage!!!`
      case (AttackOutcome.HIT): return `${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name} hits for ${floatToString(damage)} damage.`
      case (AttackOutcome.DODGED): return `${defenderName} dodges ${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name}!`
    }
  }

  private getCombatState(): CombatRoundState {
    switch (true) {
      case this.player.getHealth() <= 0 && this.npc.getHealth() <= 0: return CombatRoundState.BOTH_DEFEATED
      case this.player.getHealth() <= 0: return CombatRoundState.PLAYER_DEFEATED
      case this.npc.getHealth() <= 0: return CombatRoundState.NPC_DEFEATED
      default: return CombatRoundState.NEITHER_DEFEATED
    }
  }

  private shouldContinueCombat(): boolean {
    return this.getCombatState() === CombatRoundState.NEITHER_DEFEATED
  }

  private async handleFinalCombatState(): Promise<CombatResult> {
    const finalCombatState = this.getCombatState();
    switch(finalCombatState) {
      case CombatRoundState.BOTH_DEFEATED:
      case CombatRoundState.PLAYER_DEFEATED:
        await logAfterDelay(`${this.player.getName()} was slain by ${this.npc.getName()}!\n`, Delay.STANDARD);
        return STANDARD_COMBAT_DEFEAT;
      case CombatRoundState.NPC_DEFEATED: 
        await logAfterDelay(`${this.player.getName()} slays ${this.npc.getName()}\n`, Delay.STANDARD);
        return STANDARD_COMBAT_VICTORY;
      default:
        throw new Error("Invalid final combat state");
    }
  }
}

