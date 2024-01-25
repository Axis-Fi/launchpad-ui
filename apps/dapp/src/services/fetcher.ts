export const generateFetcher = (url: string, args?: RequestInit) => {
  return async () => {
    try {
      const result = await fetch(url, args);
      return (await result?.json()) ?? {};
    } catch (e) {
      console.error(`Failed to fetch ${url}`, e);
      throw e;
    }
  };
};

export const generateGraphqlQuery = (
  query: string,
  endpoint: string,
  variables = {},
) => {
  return generateFetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
};
