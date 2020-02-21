import { compose } from './Utility';
import { Dungeon, NPC } from './Models/Entities';
import { NPCActions } from './Models/EntityActions';
import { getRandomMinionsWithDifficulty } from './ListManipulation';

const mrBadGuy: NPC = {
  name: "Mr. Bad Guy", 
  species: "Human",
  health: 100,
  baseAttackDamage: 10
}

const earlyDungeon = {
  name: "Easy Dungeon",
  difficulty: 2,
  minions: getRandomMinionsWithDifficulty([6, 3, 5]),
  boss: mrBadGuy
};

const harderMrBadGuy = NPCActions.setHealth(
  NPCActions.setAttackDamage(mrBadGuy, 100),
  1000
)

// const makeHarder = compose(NPCActions.currySetAttackDamage(25), NPCActions.currySetHealth(50));
// const harderMrBadGuy = makeHarder(mrBadGuy);

const laterDungeon =  {
  name: "Harder Dungeon",
  difficulty: 9,
  minions: getRandomMinionsWithDifficulty([10, 7]),
  boss: harderMrBadGuy
};

export const EXAMPLE_DUNGEONS = [earlyDungeon, laterDungeon];

