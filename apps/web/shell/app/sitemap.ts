import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const routes = ["", "/about", "/contact", "/blog", "/projects"].map(
    route => ({
      url: `${baseUrl}${route?.replace(/\\/g, "/") ?? ""}`,
      lastModified: new Date().toISOString().split("T")[0],
    })
  );

  return [...routes];
}
