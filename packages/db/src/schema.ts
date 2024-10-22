import { relations, sql } from "drizzle-orm";
import {
	boolean,
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
	email: varchar("email", { length: 255 }).notNull(),
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
	watchlistMemberships: many(WatchlistMember),
	watchlistInvitationsSent: many(WatchlistInvitation, {
		relationName: "inviter",
	}),
	watchlistInvitationsReceived: many(WatchlistInvitation, {
		relationName: "invitee",
	}),
	watchlistLikes: many(WatchlistLike),
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
	posterBlurhash: text("posterBlurhash"),
	backdrop: text("backdrop"),
	releaseDate: text("releaseDate"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
		() => new Date(),
	),
});
export const MovieRelations = relations(Movie, ({ many }) => ({
	watchlistEntries: many(WatchlistEntries),
}));

// -------------------------- WATCHLIST -----------------------------
export const Watchlist = pgTable(
	"watchlist",
	{
		id: varchar("id", { length: 24 }).primaryKey(),
		userId: uuid("user_id").notNull(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		isPrivate: boolean("isPrivate").default(false),
		tags: text("tags"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
			() => new Date(),
		),
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
	invitations: many(WatchlistInvitation),
	members: many(WatchlistMember),
	likes: many(WatchlistLike),
}));

// ---------------------- WATCHLIST ENTRIES --------------------------
export const WatchlistEntries = pgTable(
	"watchlist_entries",
	{
		id: varchar("id", { length: 24 }).notNull().primaryKey(),
		order: integer("order").notNull(),
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
// ------------------ WATCHLIST INVITATIONS ----------------------
export const WatchlistInvitation = pgTable(
	"watchlist_invitation",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		watchlistId: varchar("watchlist_id").notNull(),
		inviterId: uuid("inviter_id").notNull(),
		inviteeId: uuid("invitee_id").notNull(),
		role: varchar("role", { length: 20 })
			.$type<"editor" | "viewer">()
			.notNull()
			.default("viewer"),
		inviteeEmail: varchar("invitee_email", { length: 255 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => ({
		watchlistIdx: index("watchlist_invitation_watchlist_idx").on(t.watchlistId),
		inviterIdx: index("watchlist_invitation_inviter_idx").on(t.inviterId),
		inviteeEmailIdx: index("watchlist_invitation_invitee_email_idx").on(
			t.inviteeEmail,
		),
	}),
);
export const WatchlistInvitationRelations = relations(
	WatchlistInvitation,
	({ one }) => ({
		watchlist: one(Watchlist, {
			fields: [WatchlistInvitation.watchlistId],
			references: [Watchlist.id],
		}),
		inviter: one(User, {
			fields: [WatchlistInvitation.inviterId],
			references: [User.id],
		}),
		invitee: one(User, {
			fields: [WatchlistInvitation.inviteeId],
			references: [User.id],
		}),
	}),
);

// ---------------------- WATCHLIST MEMBERS --------------------------
export const WatchlistMember = pgTable(
	"watchlist_member",
	{
		id: uuid("id").notNull().primaryKey().defaultRandom(),
		watchlistId: varchar("watchlist_id", { length: 24 }).notNull(),
		userId: uuid("user_id").notNull(),
		role: varchar("role", { length: 20 })
			.$type<"owner" | "editor" | "viewer">()
			.notNull()
			.default("viewer"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
			() => new Date(),
		),
	},
	(t) => ({
		watchlistUserIdx: index("watchlist_member_watchlist_user_idx").on(
			t.watchlistId,
			t.userId,
		),
	}),
);
export const WatchlistMemberRelations = relations(
	WatchlistMember,
	({ one }) => ({
		watchlist: one(Watchlist, {
			fields: [WatchlistMember.watchlistId],
			references: [Watchlist.id],
		}),
		user: one(User, {
			fields: [WatchlistMember.userId],
			references: [User.id],
		}),
	}),
);

// -------------------------- WATCHLIST LIKES -----------------------
export const WatchlistLike = pgTable(
	"watchlist_like",
	{
		userId: uuid("user_id").notNull(),
		watchlistId: varchar("watchlist_id", { length: 24 }).notNull(),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.userId, t.watchlistId] }),
		userIdIdx: index("watchlist_like_user_idx").on(t.userId),
		watchlistIdx: index("watchlist_like_watchlist_idx").on(t.watchlistId),
	}),
);

export const WatchlistLikeRelations = relations(WatchlistLike, ({ one }) => ({
	user: one(User, {
		fields: [WatchlistLike.userId],
		references: [User.id],
	}),
	watchlist: one(Watchlist, {
		fields: [WatchlistLike.watchlistId],
		references: [Watchlist.id],
	}),
}));
