import {
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Articles table — queued / published model per master scope §15B.
 * Public reads MUST filter by status='published'.
 */
export const articles = mysqlTable(
  "articles",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 280 }).notNull(),
    metaDescription: varchar("metaDescription", { length: 320 }).notNull().default(""),
    body: text("body").notNull(),
    tldr: text("tldr").notNull(),
    category: varchar("category", { length: 80 }).notNull().default("plant-curious"),
    tags: json("tags").$type<string[]>().notNull(),
    asinsUsed: json("asinsUsed").$type<string[]>().notNull(),
    internalLinks: json("internalLinks").$type<string[]>().notNull(),
    wordCount: int("wordCount").notNull().default(0),
    heroUrl: varchar("heroUrl", { length: 500 }).notNull().default(""),
    heroAlt: varchar("heroAlt", { length: 320 }).notNull().default(""),
    galleryUrls: json("galleryUrls").$type<string[]>().notNull(),
    author: varchar("author", { length: 80 }).notNull().default("The Oracle Lover"),
    authorCredential: varchar("authorCredential", { length: 200 }).notNull().default(
      "plant-based curiosity, 10+ years of writing about gentle dietary change"
    ),
    selfReference: text("selfReference").notNull(),
    openerType: varchar("openerType", { length: 40 }).notNull().default("provocative-question"),
    conclusionType: varchar("conclusionType", { length: 40 }).notNull().default("reflection"),
    status: mysqlEnum("status", ["queued", "published", "draft"]).notNull().default("queued"),
    queuedAt: timestamp("queuedAt").defaultNow().notNull(),
    publishedAt: timestamp("publishedAt"),
    lastModifiedAt: timestamp("lastModifiedAt"),
    seedSource: varchar("seedSource", { length: 80 }).notNull().default("manual"),
    qualityScore: int("qualityScore").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => ({
    statusQueuedIdx: index("articles_status_queuedAt").on(t.status, t.queuedAt),
    statusPublishedIdx: index("articles_status_publishedAt").on(t.status, t.publishedAt),
    categoryIdx: index("articles_category").on(t.category),
  })
);

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Savings — users can save articles for later (the Saved tab).
 */
export const savedArticles = mysqlTable(
  "savedArticles",
  {
    userId: int("userId").notNull(),
    articleId: int("articleId").notNull(),
    savedAt: timestamp("savedAt").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.articleId] }),
  })
);

export type SavedArticle = typeof savedArticles.$inferSelect;

/**
 * Cron-run history — diagnostics for verifying scheduled jobs ran.
 */
export const cronRuns = mysqlTable(
  "cronRuns",
  {
    id: int("id").autoincrement().primaryKey(),
    job: varchar("job", { length: 64 }).notNull(),
    status: mysqlEnum("status", ["ok", "skipped", "error"]).notNull(),
    detail: text("detail").notNull(),
    ranAt: timestamp("ranAt").defaultNow().notNull(),
  },
  (t) => ({
    jobIdx: index("cronRuns_job").on(t.job),
    ranAtIdx: index("cronRuns_ranAt").on(t.ranAt),
  })
);

export type CronRun = typeof cronRuns.$inferSelect;

/**
 * Verified ASINs — Amazon catalog with verification cache.
 */
export const verifiedAsins = mysqlTable("verifiedAsins", {
  asin: varchar("asin", { length: 16 }).primaryKey(),
  title: varchar("title", { length: 320 }).notNull().default(""),
  category: varchar("category", { length: 80 }).notNull().default(""),
  tags: json("tags").$type<string[]>().notNull(),
  status: mysqlEnum("status", ["valid", "invalid", "unknown"]).notNull().default("unknown"),
  lastChecked: timestamp("lastChecked").defaultNow().notNull(),
  reason: varchar("reason", { length: 200 }).notNull().default(""),
});

export type VerifiedAsin = typeof verifiedAsins.$inferSelect;
