import type { SettingsSchema } from "~~/validation/settingsSchema";
import { settingsTable } from "../db/schema";
import type { DBSettings } from "./drizzle";

export async function getSettings(): Promise<DBSettings> {
  let settings: DBSettings | undefined =
    await useDrizzle().query.settingsTable.findFirst({
      orderBy: asc(settingsTable.id),
    });
  if (!settings) {
    [settings] = await useDrizzle()
      .insert(settingsTable)
      .values({})
      .returning();
  }
  return settings!;
}

export async function updateSettings(data: SettingsSchema): Promise<void> {
  const settings = await getSettings();
  await useDrizzle()
    .update(settingsTable)
    .set(data)
    .where(eq(settingsTable.id, settings.id));
}

export interface MaintenanceStatus {
  maintenance: boolean;
  matchmakingMaintenance: boolean;
}

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  const settings = await getSettings();
  return {
    maintenance: settings.maintenance,
    matchmakingMaintenance: settings.matchmakingMaintenance,
  };
}
