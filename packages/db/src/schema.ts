import { sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const Post = pgTable("post", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const movie = pgTable("movie", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  contentId: t.integer("content_id").notNull().unique(),
  title: t.varchar({ length: 256 }).notNull(),
  overview: t.text(),
  poster: t.text(),
  posterBlurHash: t.text(),
  backdrop: t.text(),
  releaseDate: t.timestamp("release_date", { mode: "date", withTimezone: true }),
  createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const watchlist = pgTable("watchlist", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.text("user_id").notNull(),
  title: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  isPrivate: t.boolean("is_private").notNull().default(false),
  hideStats: t.boolean("hide_stats").notNull().default(false),
  numberOfEntries: t.integer("number_of_entries").notNull().default(0),
  tags: t.text(),
  createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}), (t) => ({
  userIdx: index("user_idx").on(t.userId),
}));

export const entry = pgTable("watchlist_entry", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  order: t.integer("order").notNull(),
  watchlistId: t.uuid("watchlist_id").notNull(),
  contentId: t.integer("content_id").notNull(),
  userId: t.text("user_id").notNull(),
  createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}), (t) => ({
  watchlistIdx: index("watchlist_idx").on(t.watchlistId),
  userIdx: index("user_idx").on(t.userId),
  contentIdIdx: index("content_idx").on(t.contentId),
}));

export const invite = pgTable("watchlist_invite", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  watchlistId: t.uuid("watchlist_id").notNull(),
  inviteeId: t.text("invitee_id").notNull(),
  inviterId: t.text("inviter_id").notNull(),
  role: t.varchar("role", { length: 256 }).$type<"editor" | "viewer">().notNull().default("viewer"),
  inviteeEmail: t.text("invitee_email").notNull(),
  createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}), (t) => ({
  watchlistIdx: index("watchlist_idx").on(t.watchlistId),
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export * from "./auth-schema"