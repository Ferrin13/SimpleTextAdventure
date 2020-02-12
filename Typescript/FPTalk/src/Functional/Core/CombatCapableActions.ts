import { CombatCapable } from './../Models/Entities';

export const isDefeated = (combatCapable: CombatCapable) =>
  combatCapable.health > 0;