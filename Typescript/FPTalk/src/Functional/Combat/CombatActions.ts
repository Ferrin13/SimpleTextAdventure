import { getAttackEffects } from './CombatEngine';
import { PlayerActions } from '../Core/PlayerActions';
import { NPC, Weapon, Item, Player, isWeapon, isPlayer, CombatCapable, Named } from '../Models/Entities';
import { logAfterDelay, createPrompt } from '../Utility';
import { CombatResult, combatVictory, combatDefeat, CombatOutcome} from '../Models/GameEvents';
import { DEFAULT_LOG_WAIT } from '../../Imperative/Utility';
import { CombatActionType, CombatAttack, CombatItemUse, AttackEffects, CombatRoundOutcome, CombatRoundState, isCombatAttack, isCombatItemUse, AttackOutcome, BASIC_ATTACK } from './CombatTypes';
import { isNothing, NOTHING_TYPE, NOTHING, floatToString } from '../../Shared/Utility';

export const fightEnemy = async (player: Player, npc: NPC): Promise<CombatResult> => {
  const engageCombat = await promptToEngage(player, npc);
  if(!engageCombat) return {
    outcome: CombatOutcome.RETREAT,
    player
  };

  await logAfterDelay(`${player.name} attacks ${npc.name}!`, DEFAULT_LOG_WAIT);
  return combatRound(player, npc)
}

const combatRound = async (player: Player, npc: NPC): Promise<CombatResult> => {
  await logAfterDelay(combatRoundStartDescription(player, npc), 200);

  return createPrompt('Choose a weapon or item to use\n').then(async input => {
    const action = inputHandler(input, player);
    if(isInvalidInput(action)) {
      console.log(`${input} is not in your inventory, your inventory currently is:`)
      PlayerActions.printInventory(player);
      return combatRound(player, npc)
    }
    const playerActionOutcome = executePlayerAction(player, action, npc);
    switch(playerActionOutcome.roundState) {
      case CombatRoundState.ATTACKER_DEFEATED: return onCombatDefeat(player, npc)
      case CombatRoundState.BOTH_DEFEATED: return onCombatDefeat(player, npc)
      case CombatRoundState.DEFENDER_DEFEATED: return onCombatVictory(player, npc)
      default:
    }
    const postAttackPlayer = playerActionOutcome.attacker;
    const postAttackNpc = playerActionOutcome.defender;
    const npcActionOutcome = executeAttack(postAttackNpc, BASIC_ATTACK, postAttackPlayer);
    switch(npcActionOutcome.roundState) {
      case CombatRoundState.ATTACKER_DEFEATED: return onCombatVictory(postAttackPlayer, postAttackNpc)
      case CombatRoundState.BOTH_DEFEATED: return onCombatDefeat(postAttackPlayer, postAttackNpc)
      case CombatRoundState.DEFENDER_DEFEATED: return onCombatDefeat(postAttackPlayer, postAttackNpc)
      default: return combatRound(npcActionOutcome.defender, npcActionOutcome.attacker)
    }
  })
}

const executePlayerAction = (player: Player, action: CombatAction, target: NPC): CombatRoundOutcome<Player, NPC> => {
  //Need !isPlayer for type narrowing (Also, can't use swtich(true) because type narrowing doesn't occur)
  if (isCombatAttack(action) && !isPlayer(target)) {
    return executeAttack(player, action, target)
  } else if (isCombatItemUse(action)) {
    return executePlayerItemUse(player, action, target)
  }
  throw new Error(`Invalid combat action: ${JSON.stringify(action)}`)
}

const executeAttack = <TAttacker extends CombatCapable & Named, TDefender extends CombatCapable & Named>(
  attacker: TAttacker,
  action: CombatAttack,
  defender: TDefender
): CombatRoundOutcome<TAttacker, TDefender> => {
  const attackEffects = getAttackEffects(attacker, defender, action.weapon);
  const modifiedAttacker = attackEffects.attackerChange(attacker);
  const modifiedDefender = attackEffects.defenderChange(defender);
  const damageDone = defender.health - modifiedDefender.health;
  const attackMessage = attackOutcomeDescription(attackEffects.attackOutcome, action.weapon, attacker.name, defender.name, damageDone);
  console.log(attackMessage);
  return {
    attacker: modifiedAttacker,
    defender: modifiedDefender,
    roundState: getRoundState(modifiedAttacker, modifiedDefender)
  }
}

const attackOutcomeDescription = (attackOutcome: AttackOutcome, weapon: Weapon | NOTHING_TYPE, attackerName: string, defenderName: string, damage: number): string => {
  switch (attackOutcome) {
    case (AttackOutcome.CRITICAL): return `${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name} critically strikes for ${floatToString(damage)} damage!!!`
    case (AttackOutcome.HIT): return `${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name} hits for ${floatToString(damage)} damage.`
    case (AttackOutcome.DODGED): return `${defenderName} dodges ${attackerName}'s ${isNothing(weapon) ? 'basic attack' : 'attack with ' + weapon.name}!`
  }
}

const getRoundState = (attacker: CombatCapable, defender: CombatCapable): CombatRoundState => {
  switch (true) {
    case attacker.health <= 0 && defender.health <= 0: return CombatRoundState.BOTH_DEFEATED
    case attacker.health <= 0: return CombatRoundState.ATTACKER_DEFEATED
    case defender.health <= 0: return CombatRoundState.DEFENDER_DEFEATED
    default: return CombatRoundState.NEITHER_DEFEATED
  }
}

const executePlayerItemUse = (player: Player, action: CombatItemUse, target: NPC): CombatRoundOutcome<Player, NPC> => {
  console.log(`${player}'s item is ineffectual`);
  return {
    attacker: player,
    defender: target,
    roundState: CombatRoundState.NEITHER_DEFEATED
  }
}

const onCombatVictory = async (player: Player, enemy: NPC, victoryInfo?: string): Promise<CombatResult> => {
  await logAfterDelay(`${player.name} slays ${enemy.name}`, 200);
  return combatVictory(player);
}

const onCombatDefeat = async (player: Player, enemy: NPC, victoryInfo?: string): Promise<CombatResult> => {
  await logAfterDelay(`${player.name} is defeated by ${enemy.name}`, 200);
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

const promptToEngage = async (player: Player, npc: NPC): Promise<boolean> =>
  await createPrompt(`You encounter ${npc.name}. The current combat situation is: ${playerAndNpcState(player, npc)} \nDo you wish to attack or retreat?`).then(async input => {
    switch(input.toLocaleLowerCase()) {
      case 'retreat': return false;
      case 'attack': return true;
      default: {
        console.log("Please choose either 'Attack' or 'Retreat`\n");
        return promptToEngage(player, npc);
      }
    }
  })

const combatRoundStartDescription = (player: Player, npc: NPC): string =>
  `\nCombat round started between ${playerAndNpcState(player, npc)}`

const playerAndNpcState = (player: Player, npc: NPC): string =>
  `${player.name}: (Health: ${floatToString(player.health)}/${floatToString(player.maxHealth)}) and ${npc.name}: (Health: ${floatToString(npc.health)})`

const INVALID_INPUT_SYMBOL = Symbol()
interface INVALID_INPUT_TYPE {
  symbol: typeof INVALID_INPUT_SYMBOL
}
const INVALID_INPUT: INVALID_INPUT_TYPE = {
  symbol: INVALID_INPUT_SYMBOL
}
const isInvalidInput = <T>(input: T | INVALID_INPUT_TYPE): input is INVALID_INPUT_TYPE =>
  (input as INVALID_INPUT_TYPE).symbol === INVALID_INPUT_SYMBOL;