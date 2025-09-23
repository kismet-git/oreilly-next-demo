// lib/wp.ts
export const revalidate = 600; // ISR

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const endpoint = process.env.WP_GRAPHQL_ENDPOINT!;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Optional: HTTP Basic Auth for LocalWP Live Links
  // Set WP_GRAPHQL_BASIC_AUTH to "username:password"
  const basic = process.env.WP_GRAPHQL_BASIC_AUTH;
  if (basic && basic.includes(":")) {
    // Node runtime on Vercel supports Buffer
    headers.Authorization = `Basic ${Buffer.from(basic).toString("base64")}`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // no-cache here; ISR is controlled by `revalidate` above
  });

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join("\n"));
  if (!json.data) throw new Error("No data from WPGraphQL");

  return json.data as T;
}
