import { NPC, Dungeon } from "./Entities"

export class NPCActions {
  static setHealth = (npc: NPC, newHealth: number): NPC => ({
    ...npc,
    health: newHealth
  })

  static setAttackDamage = (npc: NPC, newAttackDamage: number): NPC => ({
    ...npc,
    baseAttackDamage: newAttackDamage
  })

  static currySetHealth = (newHealth: number) => (npc: NPC): NPC => 
    NPCActions.setHealth(npc, newHealth);

  static currySetAttackDamage = (newAttackDamage: number) => (npc: NPC): NPC => 
    NPCActions.setAttackDamage(npc, newAttackDamage)
}

export class DungeonActions {
  static removeNextMinion = (dungeon: Dungeon): Dungeon => ({
    ...dungeon,
    minions: [...dungeon.minions].splice(1)
  })
}