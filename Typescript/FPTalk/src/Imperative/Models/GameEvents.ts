export class CombatResult {
  playerDefeated: boolean;
  weaponsGained: string[];
  weaponsLost: string[];

  constructor(playerDefeated: boolean, weaponsGained: string[], weaponsLost: string[]) {
    this.playerDefeated = playerDefeated;
    this.weaponsGained = weaponsGained;
    this.weaponsLost = weaponsLost;
  }
}