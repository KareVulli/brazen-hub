export const staticApiClient = $fetch.create({
  baseURL: "https://static.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
