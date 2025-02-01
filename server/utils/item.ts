import { getColumns } from "../database/getColumns";
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

export async function getItemByItemId(itemId: number): Promise<Item | null> {
  const dbItem = await useDrizzle().query.itemTable.findFirst({
    where: eq(itemTable.itemId, itemId),
    orderBy: [desc(itemTable.gameVersion)],
  });
  if (dbItem) {
    return itemFromDB(dbItem);
  }
  return null;
}

export async function getItemsByGameVersion(
  gameVersion: string | number
): Promise<Record<number, Item | undefined>> {
  console.log(gameVersion, typeof gameVersion);
  const dbItems = await useDrizzle().query.itemTable.findMany({
    where: eq(itemTable.gameVersion, gameVersion + ""),
    orderBy: [desc(itemTable.gameVersion), asc(itemTable.itemId)],
  });
  return dbItems
    .map((item) => itemFromDB(item))
    .reduce<Record<number, Item>>((acc, item) => {
      acc[item.itemId] = item;
      return acc;
    }, {});
}

export function getLatestItemsSubquery() {
  const subQuery = useDrizzle()
    .$with("items_with_row_number")
    .as(
      useDrizzle()
        .select({
          ...getColumns(itemTable),
          rowNumber: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${itemTable.itemId}
          ORDER BY ${itemTable.gameVersion} DESC
        )`.as("row_number"),
        })
        .from(itemTable)
    );

  const { rowNumber, ...subQueryColumns } = getColumns(subQuery);
  return useDrizzle()
    .$with("latest_items")
    .as(
      useDrizzle()
        .with(subQuery)
        .select(subQueryColumns)
        .from(subQuery)
        .where(eq(subQuery.rowNumber, 1))
    );
}
