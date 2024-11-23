import { relations, sql } from "drizzle-orm";
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const Post = pgTable("post", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	title: t.varchar({ length: 256 }).notNull(),
	content: t.text().notNull(),
	createdAt: t
		.timestamp("created_at", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
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
	posterBlurHash: t.text("poster_blur_hash"),
	backdrop: t.text(),
	releaseDate: t.text("release_date"),
	createdAt: t
		.timestamp("created_at", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: t
		.timestamp("updated_at", { mode: "date", withTimezone: true })
		.$onUpdateFn(() => sql`now()`),
}));
export const movieRelations = relations(movie, ({ many }) => ({
	entries: many(entry),
}));

export const watchlist = pgTable(
	"watchlist",
	(t) => ({
		id: t.varchar("id", { length: 24 }).primaryKey(),
		userId: t.text("user_id").notNull(),
		title: t.varchar({ length: 256 }).notNull(),
		description: t.text(),
		isPrivate: t.boolean("is_private").notNull().default(false),
		hideStats: t.boolean("hide_stats").notNull().default(false),
		numberOfEntries: t.integer("number_of_entries").notNull().default(0),
		tags: t.text(),
		createdAt: t
			.timestamp("created_at", { mode: "date", withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: t
			.timestamp("updated_at", { mode: "string", withTimezone: true })
			.$onUpdateFn(() => sql`now()`),
	}),
	(t) => ({
		userIdx: index("watchlist_user_idx").on(t.userId),
	}),
);
export const watchlistRelations = relations(watchlist, ({ many, one }) => ({
	user: one(user, {
		fields: [watchlist.userId],
		references: [user.id],
	}),
	entries: many(entry),
	invites: many(invite),
	members: many(member),
	likes: many(like),
	watched: many(watched),
}));

export const entry = pgTable(
	"watchlist_entry",
	(t) => ({
		id: t.uuid().notNull().primaryKey().defaultRandom(),
		order: t.integer("order").notNull(),
		watchlistId: t.varchar("watchlist_id").notNull(),
		contentId: t.integer("content_id").notNull(),
		userId: t.text("user_id").notNull(),
		createdAt: t
			.timestamp("created_at", { mode: "date", withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: t
			.timestamp("updated_at", { mode: "string", withTimezone: true })
			.$onUpdateFn(() => sql`now()`),
	}),
	(t) => ({
		watchlistIdx: index("entry_watchlist_idx").on(t.watchlistId),
		userIdx: index("entry_user_idx").on(t.userId),
		contentIdIdx: index("entry_content_idx").on(t.contentId),
	}),
);
export const entryRelations = relations(entry, ({ one, many }) => ({
	watchlist: one(watchlist, {
		fields: [entry.watchlistId],
		references: [watchlist.id],
	}),
	movie: one(movie, {
		fields: [entry.contentId],
		references: [movie.contentId],
	}),
	user: one(user, {
		fields: [entry.userId],
		references: [user.id],
	}),
	watched: many(watched),
}));

export const invite = pgTable(
	"watchlist_invite",
	(t) => ({
		id: t.uuid().notNull().primaryKey().defaultRandom(),
		watchlistId: t.varchar("watchlist_id").notNull(),
		inviteeId: t.text("invitee_id").notNull(),
		inviterId: t.text("inviter_id").notNull(),
		role: t
			.varchar("role", { length: 256 })
			.$type<"editor" | "viewer">()
			.notNull()
			.default("viewer"),
		inviteeEmail: t.text("invitee_email").notNull(),
		createdAt: t
			.timestamp("created_at", { mode: "date", withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: t
			.timestamp("updated_at", { mode: "date", withTimezone: true })
			.$onUpdateFn(() => sql`now()`),
	}),
	(t) => ({
		watchlistIdx: index("invite_watchlist_idx").on(t.watchlistId),
	}),
);
export const inviteRelations = relations(invite, ({ one }) => ({
	watchlist: one(watchlist, {
		fields: [invite.watchlistId],
		references: [watchlist.id],
	}),
	invitee: one(user, {
		fields: [invite.inviteeId],
		references: [user.id],
	}),
	inviter: one(user, {
		fields: [invite.inviterId],
		references: [user.id],
	}),
}));

export const member = pgTable(
	"watchlist_member",
	(t) => ({
		id: t.uuid().notNull().primaryKey().defaultRandom(),
		watchlistId: t.varchar("watchlist_id").notNull(),
		userId: t.text("user_id").notNull(),
		role: t
			.varchar("role", { length: 256 })
			.$type<"owner" | "editor" | "viewer">()
			.notNull()
			.default("viewer"),
		createdAt: t
			.timestamp("created_at", { mode: "date", withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: t
			.timestamp("updated_at", { mode: "date", withTimezone: true })
			.$onUpdateFn(() => sql`now()`),
	}),
	(t) => ({
		watchlistIdx: index("member_watchlist_idx").on(t.watchlistId),
	}),
);
export const memberRelations = relations(member, ({ one, many }) => ({
	watchlist: one(watchlist, {
		fields: [member.watchlistId],
		references: [watchlist.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
	watched: many(watched),
}));

export const like = pgTable(
	"watchlist_like",
	(t) => ({
		watchlistId: t.varchar("watchlist_id").notNull(),
		userId: t.text("user_id").notNull(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.watchlistId, t.userId] }),
		watchlistIdx: index("like_watchlist_idx").on(t.watchlistId),
		userIdx: index("like_user_idx").on(t.userId),
	}),
);
export const likeRelations = relations(like, ({ one }) => ({
	watchlist: one(watchlist, {
		fields: [like.watchlistId],
		references: [watchlist.id],
	}),
	user: one(user, {
		fields: [like.userId],
		references: [user.id],
	}),
}));

export const watched = pgTable("watched", (t) => ({
	id: t.uuid().notNull().primaryKey().defaultRandom(),
	watchlistId: t.varchar("watchlist_id").notNull(),
	userId: t.text("user_id").notNull(),
	memberId: t.uuid("member_id").notNull(),
	entryId: t.uuid("entry_id").notNull(),
	createdAt: t
		.timestamp("created_at", { mode: "date", withTimezone: true })
		.defaultNow()
		.notNull(),
}));
export const watchedRelations = relations(watched, ({ one }) => ({
	watchlist: one(watchlist, {
		fields: [watched.watchlistId],
		references: [watchlist.id],
	}),
	member: one(member, {
		fields: [watched.memberId],
		references: [member.id],
	}),
	entry: one(entry, {
		fields: [watched.entryId],
		references: [entry.id],
	}),
	user: one(user, {
		fields: [watched.userId],
		references: [user.id],
	}),
}));

export const CreatePostSchema = createInsertSchema(Post, {
	title: z.string().max(256),
	content: z.string().max(256),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export * from "./auth-schema";
