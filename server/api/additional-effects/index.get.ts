import type { AdditionalEffectDto } from "~~/server/utils/additionalEffect";

export default eventHandler(async (event): Promise<AdditionalEffectDto[]> => {
  await checkAllowedToUpdate(event);

  return (await getLatestAdditionalEffects()).map((item) =>
    additionalEffectToDto(item),
  );
});
