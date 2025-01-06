import { itemTable } from "../database/schema/item";
import type { DBItem } from "./drizzle";

export interface ItemDto {
  id: number;
  name: string;
  description: string;
  icon: string;
  hudIcon: string;
  count: number;
}

export interface Item {
  id: number;
  itemId: number;
  gameVersion: string;
  name: string;
  description: string;
  icon: string;
  hudIcon: string;
  count: number;
}

export async function replaceitemsInDB(gameVersion: string, items: ItemDto[]) {
  await useDrizzle()
    .delete(itemTable)
    .where(eq(itemTable.gameVersion, gameVersion));
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await writeitemToDB(gameVersion, item);
  }
}

export async function writeitemToDB(gameVersion: string, itemDto: ItemDto) {
  await useDrizzle().insert(itemTable).values({
    gameVersion: gameVersion,
    itemId: itemDto.id,
    name: itemDto.name,
    description: itemDto.description,
    icon: itemDto.icon,
    hudIcon: itemDto.hudIcon,
    count: itemDto.count,
  });
}

export function itemFromDB(item: DBItem): Item {
  return {
    id: item.id,
    itemId: item.itemId,
    gameVersion: item.gameVersion,
    name: item.name,
    description: item.description,
    icon: item.icon,
    hudIcon: item.hudIcon,
    count: item.count,
  };
}
