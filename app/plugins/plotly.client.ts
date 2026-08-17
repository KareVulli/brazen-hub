import Plotly from "plotly.js-dist-min";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      plotly: Plotly,
    },
  };
});
