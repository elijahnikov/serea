import { relations, sql } from "drizzle-orm";
import { longtext } from "drizzle-orm/mysql-core";
import {
	date,
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
export const Movie = pgTable("movie", {
	id: uuid("id").notNull().primaryKey().defaultRandom(),
	contentId: integer("contentId").notNull(),
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
