import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}`
    : "http://localhost:3000";

  const routes = ["", "/about", "/contact", "/blog", "/projects"].map(
    route => ({
      url: `${baseUrl}${route?.replace(/\\/g, "/") ?? ""}`,
      lastModified: new Date().toISOString().split("T")[0],
    })
  );

  return [...routes];
}
