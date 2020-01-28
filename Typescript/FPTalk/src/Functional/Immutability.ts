import { NPC, Dungeon, NPCActions } from './GameObjects';
import { compose } from './Utility';

const mrBadGuy: NPC = {
  name: "Mr. Bad Guy", 
  species: "Human",
  health: 100,
  attackDamage: 10
}

const earlyDungeon = new Dungeon("Easy Dungeon", 2, mrBadGuy);

// const mrBadGuyIncreasedAD = NPCActions.setAttackDamage(mrBadGuy, 100)
// const harderMrBadGuy = NPCActions.setHealth(mrBadGuyIncreasedAD, 1000)

// const harderMrBadGuy = NPCActions.setHealth(
//   NPCActions.setAttackDamage(mrBadGuy, 100),
//   1000
// )

// const harderMrBadGuy = {
//   ...mrBadGuy, 
//   health: 1000,
//   attackDamage: 100
// }

const makeHarder = compose(NPCActions.currySetAttackDamage(25), NPCActions.currySetHealth(50));
const harderMrBadGuy = makeHarder(mrBadGuy);

const laterDungeon = new Dungeon("Hard Dungeon", 9, harderMrBadGuy);

export const EXAMPLE_DUNGEONS = [earlyDungeon, laterDungeon];

