export type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  body: string[]; // paragraphs
};

import newsJson from "@/content/news.json";

export const posts = newsJson as Post[];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
