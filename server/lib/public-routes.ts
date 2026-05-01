import type { Express, Request, Response } from "express";
import { getDb } from "../db";
import { articles } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { buildLlmsFullTxt, buildLlmsTxt, buildRobotsTxt, buildSitemapXml } from "./aeo";
import { SITE } from "./site-config";

/**
 * www -> apex 301 redirect. Master scope §17B.
 * Runs as the FIRST middleware in the stack.
 */
export function wwwToApexRedirect(req: Request, res: Response, next: () => void): void {
  const host = (req.headers.host || "").toLowerCase();
  if (host.startsWith("www.")) {
    const apex = host.slice(4);
    const proto = (req.headers["x-forwarded-proto"] as string) || "https";
    res.redirect(301, `${proto}://${apex}${req.originalUrl}`);
    return;
  }
  next();
}

export function registerPublicRoutes(app: Express): void {
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", site: SITE.name, time: new Date().toISOString() });
  });

  app.get("/robots.txt", (_req, res) => {
    res.set("Cache-Control", "public, max-age=3600");
    res.type("text/plain").send(buildRobotsTxt());
  });

  app.get("/sitemap.xml", async (_req, res) => {
    const db = await getDb();
    if (!db) {
      res.type("application/xml").send(buildSitemapXml([]));
      return;
    }
    const rows = await db
      .select({
        slug: articles.slug,
        publishedAt: articles.publishedAt,
        lastModifiedAt: articles.lastModifiedAt,
      })
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
    res.set("Cache-Control", "public, max-age=3600");
    res.type("application/xml").send(buildSitemapXml(rows));
  });

  app.get("/llms.txt", async (_req, res) => {
    const db = await getDb();
    if (!db) {
      res.type("text/markdown").send(buildLlmsTxt([]));
      return;
    }
    const rows = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        category: articles.category,
      })
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
    res.set("Cache-Control", "public, max-age=3600");
    res.type("text/markdown").send(buildLlmsTxt(rows));
  });

  app.get("/llms-full.txt", async (_req, res) => {
    const db = await getDb();
    if (!db) {
      res.type("text/plain").send(buildLlmsFullTxt([]));
      return;
    }
    const rows = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        category: articles.category,
        tags: articles.tags,
        body: articles.body,
        publishedAt: articles.publishedAt,
        lastModifiedAt: articles.lastModifiedAt,
        author: articles.author,
      })
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
    res.set("Cache-Control", "public, max-age=3600");
    res.type("text/plain").send(buildLlmsFullTxt(rows));
  });
}
