import type { MaintenanceStatus } from "~~/server/utils/settings";
import { getMaintenanceStatus } from "~~/server/utils/settings";

export default eventHandler(async (): Promise<MaintenanceStatus> => {
  return await getMaintenanceStatus();
});
