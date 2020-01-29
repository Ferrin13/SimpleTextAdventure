import { compose } from './Utility';
import { Dungeon, NPC } from './Models/Entities';
import { NPCActions } from './Models/EntityActions';

const mrBadGuy: NPC = {
  name: "Mr. Bad Guy", 
  species: "Human",
  health: 100,
  attackDamage: 10
}

const earlyDungeon = new Dungeon("Easy Dungeon", 2, mrBadGuy);

const harderMrBadGuy = NPCActions.setHealth(
  NPCActions.setAttackDamage(mrBadGuy, 100),
  1000
)

// const makeHarder = compose(NPCActions.currySetAttackDamage(25), NPCActions.currySetHealth(50));
// const harderMrBadGuy = makeHarder(mrBadGuy);

const laterDungeon = new Dungeon("Hard Dungeon", 9, harderMrBadGuy);

export const EXAMPLE_DUNGEONS = [earlyDungeon, laterDungeon];

