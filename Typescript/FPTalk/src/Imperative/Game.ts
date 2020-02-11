import { EXAMPLE_DUNGEONS } from './Immutability';
import { Player } from './Models/Player';
import { Item, Weapon } from './Models/Entities';
import { DungeonTraverser } from './Core/DungeonTraverser';

async function executeGame(): Promise<void> {
  const player = new Player('Ferrin', 100, 100);
  player.addWeapons(new Weapon('Sword', 10))
  player.addItems(new Item('Health Potion'))
  for(let i = 0; i < EXAMPLE_DUNGEONS.length; i++) {
    const dungeonTraverer = new DungeonTraverser(player, EXAMPLE_DUNGEONS[i]);
    await dungeonTraverer.traverse();
  }
}

executeGame();
