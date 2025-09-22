import { wpQuery } from "@/lib/wp";

export const revalidate = 600; // ISR

type PostData = {
  postBy: { slug: string; title: string; content: string } | null;
};

async function getPost(slug: string) {
  const data = await wpQuery<PostData>(/* GraphQL */ `
    query PostBySlug($slug: String!) {
      postBy(slug: $slug) {
        slug
        title
        content
      }
    }
  `, { slug });
  return data.postBy;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    return (
      <main style={{ maxWidth: 820, margin: "3rem auto", padding: "0 1rem" }}>
        <h1>Not found</h1>
      </main>
    );
  }
  return (
    <main style={{ maxWidth: 820, margin: "3rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", lineHeight: 1.2 }}>{post.title}</h1>
      <article
        style={{ marginTop: "1.5rem" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
