import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { articles } from "../drizzle/schema";
import {
  countPublished,
  getPublishedBySlug,
  insertArticle,
  listCronRuns,
  listPublished,
  listSavedFor,
  toggleSaved,
} from "./lib/article-db";
import { generateArticle } from "./lib/article-generator";
import { TOPICS } from "./lib/seed-data";
import { assignHeroImage } from "./lib/bunny";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  articles: router({
    list: publicProcedure
      .input(
        z
          .object({
            limit: z.number().min(1).max(48).default(24),
            offset: z.number().min(0).default(0),
            category: z.string().optional(),
            q: z.string().optional(),
          })
          .default(() => ({ limit: 24, offset: 0 }))
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { items: [], total: 0 };
        const conds = [eq(articles.status, "published" as const)];
        if (input.category) conds.push(eq(articles.category, input.category));
        if (input.q) {
          conds.push(
            or(
              like(articles.title, `%${input.q}%`),
              like(articles.metaDescription, `%${input.q}%`),
              like(articles.body, `%${input.q}%`)
            )!
          );
        }
        const where = conds.length === 1 ? conds[0] : and(...conds);
        const items = await db
          .select()
          .from(articles)
          .where(where)
          .orderBy(desc(articles.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
        const totalRows = await db
          .select({ c: sql<number>`count(*)` })
          .from(articles)
          .where(where);
        return { items, total: Number(totalRows[0]?.c ?? 0) };
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1) }))
      .query(async ({ input }) => {
        const a = await getPublishedBySlug(input.slug);
        if (!a) throw new TRPCError({ code: "NOT_FOUND" });
        return a;
      }),

    countPublished: publicProcedure.query(async () => ({ count: await countPublished() })),
  }),

  saved: router({
    list: protectedProcedure.query(async ({ ctx }) => listSavedFor(ctx.user.id)),
    toggle: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const saved = await toggleSaved(ctx.user.id, input.articleId);
        return { saved };
      }),
  }),

  admin: router({
    cronRuns: publicProcedure.query(async () => {
      const rows = await listCronRuns(50);
      const byJob: Record<string, { ok: number; skipped: number; error: number; lastAt?: Date }> = {};
      for (const r of rows) {
        const j = (byJob[r.job] = byJob[r.job] || { ok: 0, skipped: 0, error: 0 });
        j[r.status]++;
        if (!j.lastAt || r.ranAt > j.lastAt) j.lastAt = r.ranAt;
      }
      return { rows, byJob };
    }),
    generateOne: protectedProcedure
      .input(z.object({ slug: z.string().optional() }).default({}))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const used = new Set<string>(
          (await db.select({ slug: articles.slug }).from(articles)).map((r) => r.slug)
        );
        const topic = input.slug
          ? TOPICS.find((t) => t.slug === input.slug)
          : TOPICS.find((t) => !used.has(t.slug));
        if (!topic) return { ok: false, reason: "topics exhausted" };
        const result = await generateArticle(topic);
        if (!result.ok || !result.article) return { ok: false, reason: result.errors?.join("; ") || "gate failed" };
        const a = result.article;
        const hero = assignHeroImage(a.slug, a.tags);
        await insertArticle({
          slug: a.slug,
          title: a.title,
          metaDescription: a.metaDescription,
          body: a.body,
          tldr: a.tldr,
          category: a.category,
          tags: a.tags,
          asinsUsed: a.asinsUsed,
          internalLinks: a.internalLinks,
          wordCount: a.wordCount,
          heroUrl: hero.url,
          heroAlt: hero.alt,
          galleryUrls: a.galleryUrls,
          author: a.author,
          authorCredential:
            "plant-based curiosity, 10+ years of writing about gentle dietary change",
          selfReference: a.selfReference,
          openerType: "provocative-question",
          conclusionType: "reflection",
          status: "queued",
          seedSource: a.seedSource,
          qualityScore: a.qualityScore,
        });
        return { ok: true, slug: a.slug, attempts: result.attempts };
      }),
  }),
});

export type AppRouter = typeof appRouter;
