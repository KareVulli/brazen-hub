import type { Config } from "tailwindcss";
// @ts-expect-error no declared types at this time
import PrimeUI from "tailwindcss-primeui";
import Typography from "@tailwindcss/typography";

export default <Partial<Config>>{
  plugins: [PrimeUI, Typography],
  theme: {
    extend: {
      aspectRatio: {
        "3/4": "3 / 4",
      },
    },
  },
};
