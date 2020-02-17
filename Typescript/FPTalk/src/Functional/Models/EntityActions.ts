import { NPC } from "./Entities"

export class NPCActions {
  static setHealth = (npc: NPC, newHealth: number): NPC => {
    return {
      ...npc,
      health: newHealth
    }
  }

  static setAttackDamage = (npc: NPC, newAttackDamage: number): NPC => {
    return {
      ...npc,
      baseAttackDamage: newAttackDamage
    }
  }

  static currySetHealth = (newHealth: number) => (npc: NPC): NPC => {
    return {
      ...npc,
      health: newHealth
    }
  }

  static currySetAttackDamage = (newAttackDamage: number) => (npc: NPC): NPC => {
    return {
      ...npc,
      baseAttackDamage: newAttackDamage
    }
  }
}