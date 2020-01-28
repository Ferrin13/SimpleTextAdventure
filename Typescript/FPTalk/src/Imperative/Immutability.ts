import {NPC, Dungeon} from './GameObjects';

const mrBadGuy = new NPC("Mr. Bad Guy", "Human", 10, 100);

const earlyDungeon = new Dungeon("Easy Dungeon", 2, mrBadGuy);

const harderMyBadGuy = mrBadGuy;
harderMyBadGuy.setHealth(1000);
harderMyBadGuy.setAttackDamage(100);

const laterDungeon = new Dungeon("Hard Dungeon", 9, harderMyBadGuy);

export const EXAMPLE_DUNGEONS = [earlyDungeon, laterDungeon];

