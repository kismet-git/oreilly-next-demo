export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT!;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }
  if (!json.data) {
    throw new Error("No data from WPGraphQL");
  }
  return json.data;
}
