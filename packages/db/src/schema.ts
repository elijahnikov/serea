import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// ------------------------------------------------------------------
// ------------------------------ AUTH ------------------------------
// ------------------------------------------------------------------
export const User = pgTable("user", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }),
	emailVerified: timestamp("emailVerified", {
		mode: "date",
		withTimezone: true,
	}),
	image: varchar("image", { length: 255 }),
});
export const UserRelations = relations(User, ({ many }) => ({
	accounts: many(Account),
	watchlists: many(Watchlist),
	watchlistEntries: many(WatchlistEntries),
}));

export const Account = pgTable(
	"account",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => User.id, { onDelete: "cascade" }),
		type: varchar("type", { length: 255 })
			.$type<"email" | "oauth" | "oidc" | "webauthn">()
			.notNull(),
		provider: varchar("provider", { length: 255 }).notNull(),
		providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
		refresh_token: varchar("refresh_token", { length: 255 }),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: varchar("token_type", { length: 255 }),
		scope: varchar("scope", { length: 255 }),
		id_token: text("id_token"),
		session_state: varchar("session_state", { length: 255 }),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const AccountRelations = relations(Account, ({ one }) => ({
	user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
	sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
	userId: uuid("userId")
		.notNull()
		.references(() => User.id, { onDelete: "cascade" }),
	expires: timestamp("expires", {
		mode: "date",
		withTimezone: true,
	}).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
	user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

export const VerificationTokens = pgTable(
	"verification_token",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	}),
);

// ------------------------------------------------------------------
// ----------------------------- TABLES -----------------------------
// ------------------------------------------------------------------

// ----------------------------- MOVIE ------------------------------
export const Movie = pgTable("movie", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	contentId: integer("contentId").notNull().unique(),
	title: varchar("title", { length: 255 }).notNull(),
	overview: text("overview"),
	poster: text("poster"),
	backdrop: text("backdrop"),
	releaseDate: text("releaseDate"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", {
		mode: "date",
		withTimezone: true,
	}).$onUpdateFn(() => sql`now()`),
});
export const MovieRelations = relations(Movie, ({ many }) => ({
	watchlistEntries: many(WatchlistEntries),
}));

// -------------------------- WATCHLIST -----------------------------
export const Watchlist = pgTable(
	"watchlist",
	{
		id: varchar("id", { length: 24 }).primaryKey(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		isPrivate: boolean("isPrivate").default(false),
		tags: text("tags"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updatedAt", {
			mode: "date",
			withTimezone: true,
		}).$onUpdateFn(() => sql`now()`),
	},
	(t) => ({
		userIdx: index("watchlist_user_idx").on(t.userId),
		createdAtIdx: index("watchlist_created_at_idx").on(t.createdAt),
	}),
);
export const WatchlistRelations = relations(Watchlist, ({ one, many }) => ({
	user: one(User, {
		fields: [Watchlist.userId],
		references: [User.id],
	}),
	entries: many(WatchlistEntries),
}));

// ---------------------- WATCHLIST ENTRIES --------------------------
export const WatchlistEntries = pgTable(
	"watchlist_entries",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		watchlistId: varchar("watchlist_id").notNull(),
		contentId: integer("content_id").notNull(),
		userId: varchar("user_id").notNull(),
		createdAt: timestamp("added_at").defaultNow().notNull(),
	},
	(t) => ({
		// compoundKey: primaryKey({ columns: [t.watchlistId, t.contentId] }),
		watchlistIdx: index("watchlist_entries_watchlist_idx").on(t.watchlistId),
		movieIdx: index("watchlist_entries_movie_idx").on(t.contentId),
		userIdx: index("watchlist_entries_user_idx").on(t.userId),
	}),
);
export const WatchlistEntriesRelations = relations(
	WatchlistEntries,
	({ one }) => ({
		watchlist: one(Watchlist, {
			fields: [WatchlistEntries.watchlistId],
			references: [Watchlist.id],
		}),
		movie: one(Movie, {
			fields: [WatchlistEntries.contentId],
			references: [Movie.contentId],
		}),
		user: one(User, {
			fields: [WatchlistEntries.userId],
			references: [User.id],
		}),
	}),
);
