export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);

  console.log("No active migration found");

  console.log("Migration: Done");
});
