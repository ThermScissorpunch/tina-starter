import React from "react";
import client from "../../../tina/__generated__/client";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const relativePath = `${params.filename.join("/")}.md`;

  let data;
  try {
    data = await client.queries.post({ relativePath });
  } catch {
    notFound();
  }

  if (!data?.data?.post) {
    notFound();
  }

  return (
    <Layout rawPageData={data}>
      <PostClientPage {...data} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const posts = await client.queries.postConnection();
  const paths =
    posts.data?.postConnection.edges
      .map((edge) => ({
        filename: edge.node._sys.breadcrumbs,
      }))
      .filter((p) => Array.isArray(p.filename) && p.filename.length > 0) || [];

  return paths;
}
