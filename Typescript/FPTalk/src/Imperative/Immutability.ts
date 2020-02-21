import { Dungeon, NPC } from "./Models/Entities";
import { getRandomMinionsWithDifficulty } from "./ListManipulation";

const mrBadGuy = new NPC("Mr. Bad Guy", "Human", 10, 100);

const earlyDungeon = new Dungeon("Easy Dungeon", 2, mrBadGuy);
earlyDungeon.addMinions(getRandomMinionsWithDifficulty([4, 5, 3]))

const harderMyBadGuy = mrBadGuy; //Bug
harderMyBadGuy.setHealth(1000);
harderMyBadGuy.setBaseAttackDamage(100);

const laterDungeon = new Dungeon("Hard Dungeon", 9, harderMyBadGuy);
laterDungeon.addMinions(getRandomMinionsWithDifficulty([8, 9]))

export const EXAMPLE_DUNGEONS = [earlyDungeon, laterDungeon];

