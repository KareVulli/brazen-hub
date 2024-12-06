import type { Config } from "tailwindcss";
// @ts-expect-error no declared types at this time
import PrimeUI from "tailwindcss-primeui";

export default <Partial<Config>>{
  plugins: [PrimeUI],
};
