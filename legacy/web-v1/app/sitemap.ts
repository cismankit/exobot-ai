import type { MetadataRoute } from "next";

const siteUrl = "https://www.exobod.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/desk-one", changeFrequency: "weekly", priority: 0.95 },
    { path: "/customize", changeFrequency: "weekly", priority: 0.9 },
    { path: "/preorder", changeFrequency: "weekly", priority: 0.8 },
    { path: "/trust", changeFrequency: "monthly", priority: 0.75 },
    { path: "/demo", changeFrequency: "monthly", priority: 0.65 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/partners", changeFrequency: "monthly", priority: 0.55 },
    { path: "/company", changeFrequency: "monthly", priority: 0.5 },
    { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/safety", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/warranty", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/refund", changeFrequency: "yearly", priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
