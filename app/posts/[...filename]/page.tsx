import React from "react";
import type { Metadata } from "next";
import client from "../../../tina/__generated__/client";
import Layout from "../../../components/layout/layout";
import PostClientPage from "./client-page";
import { notFound } from "next/navigation";

async function getPost(filename: string[]) {
  const relativePath = `${filename.join("/")}.md`;
  try {
    return await client.queries.post({ relativePath });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { filename: string[] };
}): Promise<Metadata> {
  const data = await getPost(params.filename);
  if (!data?.data?.post) return {};

  const post = data.data.post;
  const description =
    post.description ||
    (typeof post.excerpt === "string"
      ? post.excerpt
      : post.title);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.winkelstraat.nl";
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const imageUrl = post.heroImg
    ? post.heroImg.startsWith("http")
      ? post.heroImg
      : `${siteUrl}${post.heroImg}`
    : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: postUrl,
      publishedTime: post.date || undefined,
      modifiedTime: post.lastUpdated || post.date || undefined,
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { filename: string[] };
}) {
  const data = await getPost(params.filename);

  if (!data?.data?.post) {
    notFound();
  }

  const post = data.data.post;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.winkelstraat.nl";
  const imageUrl = post.heroImg
    ? post.heroImg.startsWith("http")
      ? post.heroImg
      : `${siteUrl}${post.heroImg}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description:
      post.description ||
      (typeof post.excerpt === "string" ? post.excerpt : post.title),
    ...(imageUrl && { image: imageUrl }),
    datePublished: post.date || undefined,
    dateModified: post.lastUpdated || post.date || undefined,
    url: `${siteUrl}/posts/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Winkelstraat.nl",
      url: siteUrl,
    },
    ...(post.author && {
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    }),
  };

  return (
    <Layout rawPageData={data}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
