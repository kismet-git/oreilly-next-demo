# O’Reilly Next.js Demo

Headless frontend for WordPress via WPGraphQL.

## Routes
- `/articles/[slug]` — renders `post.content` (ISR: `revalidate = 600`)
- `/api/revalidate` — POST `{ "path": "/articles/<slug>", "secret": "<REVALIDATE_SECRET>" }` → `revalidatePath(path)`

## Env (.env.local)
WP_GRAPHQL_ENDPOINT=http://oreilly.local/graphql
REVALIDATE_SECRET=dev-secret-change-me

## Dev
npm run dev  (we used port 3001: `npm run dev -- -p 3001`)
