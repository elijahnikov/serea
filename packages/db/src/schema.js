"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostSchema = exports.watchedRelations = exports.watched = exports.likeRelations = exports.like = exports.memberRelations = exports.member = exports.inviteRelations = exports.invite = exports.entryRelations = exports.entry = exports.watchlistRelations = exports.watchlist = exports.movieRelations = exports.movie = exports.Post = void 0;
var drizzle_orm_1 = require("drizzle-orm");
var pg_core_1 = require("drizzle-orm/pg-core");
var drizzle_zod_1 = require("drizzle-zod");
var zod_1 = require("zod");
var auth_schema_1 = require("./auth-schema");
exports.Post = (0, pg_core_1.pgTable)("post", function (t) { return ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 256 }).notNull(),
    content: t.text().notNull(),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
        .timestamp("updated_at", { mode: "date", withTimezone: true })
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); });
exports.movie = (0, pg_core_1.pgTable)("movie", function (t) { return ({
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
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); });
exports.movieRelations = (0, drizzle_orm_1.relations)(exports.movie, function (_a) {
    var many = _a.many;
    return ({
        entries: many(exports.entry),
    });
});
exports.watchlist = (0, pg_core_1.pgTable)("watchlist", function (t) { return ({
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
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); }, function (t) { return ({
    userIdx: (0, pg_core_1.index)("watchlist_user_idx").on(t.userId),
}); });
exports.watchlistRelations = (0, drizzle_orm_1.relations)(exports.watchlist, function (_a) {
    var many = _a.many, one = _a.one;
    return ({
        user: one(auth_schema_1.user, {
            fields: [exports.watchlist.userId],
            references: [auth_schema_1.user.id],
        }),
        entries: many(exports.entry),
        invites: many(exports.invite),
        members: many(exports.member),
        likes: many(exports.like),
        watched: many(exports.watched),
    });
});
exports.entry = (0, pg_core_1.pgTable)("watchlist_entry", function (t) { return ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    order: t.integer("order").notNull(),
    watchlistId: t.uuid("watchlist_id").notNull(),
    contentId: t.integer("content_id").notNull(),
    userId: t.text("user_id").notNull(),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
        .timestamp("updated_at", { mode: "date", withTimezone: true })
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); }, function (t) { return ({
    watchlistIdx: (0, pg_core_1.index)("entry_watchlist_idx").on(t.watchlistId),
    userIdx: (0, pg_core_1.index)("entry_user_idx").on(t.userId),
    contentIdIdx: (0, pg_core_1.index)("entry_content_idx").on(t.contentId),
}); });
exports.entryRelations = (0, drizzle_orm_1.relations)(exports.entry, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        watchlist: one(exports.watchlist, {
            fields: [exports.entry.watchlistId],
            references: [exports.watchlist.id],
        }),
        movie: one(exports.movie, {
            fields: [exports.entry.contentId],
            references: [exports.movie.contentId],
        }),
        user: one(auth_schema_1.user, {
            fields: [exports.entry.userId],
            references: [auth_schema_1.user.id],
        }),
        watched: many(exports.watched),
    });
});
exports.invite = (0, pg_core_1.pgTable)("watchlist_invite", function (t) { return ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    watchlistId: t.uuid("watchlist_id").notNull(),
    inviteeId: t.text("invitee_id").notNull(),
    inviterId: t.text("inviter_id").notNull(),
    role: t.varchar("role", { length: 256 }).$type().notNull().default("viewer"),
    inviteeEmail: t.text("invitee_email").notNull(),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
        .timestamp("updated_at", { mode: "date", withTimezone: true })
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); }, function (t) { return ({
    watchlistIdx: (0, pg_core_1.index)("invite_watchlist_idx").on(t.watchlistId),
}); });
exports.inviteRelations = (0, drizzle_orm_1.relations)(exports.invite, function (_a) {
    var one = _a.one;
    return ({
        watchlist: one(exports.watchlist, {
            fields: [exports.invite.watchlistId],
            references: [exports.watchlist.id],
        }),
        invitee: one(auth_schema_1.user, {
            fields: [exports.invite.inviteeId],
            references: [auth_schema_1.user.id],
        }),
        inviter: one(auth_schema_1.user, {
            fields: [exports.invite.inviterId],
            references: [auth_schema_1.user.id],
        }),
    });
});
exports.member = (0, pg_core_1.pgTable)("watchlist_member", function (t) { return ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    watchlistId: t.uuid("watchlist_id").notNull(),
    userId: t.text("user_id").notNull(),
    role: t.varchar("role", { length: 256 }).$type().notNull().default("viewer"),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
        .timestamp("updated_at", { mode: "date", withTimezone: true })
        .$onUpdateFn(function () { return (0, drizzle_orm_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["now()"], ["now()"]))); }),
}); }, function (t) { return ({
    watchlistIdx: (0, pg_core_1.index)("member_watchlist_idx").on(t.watchlistId),
}); });
exports.memberRelations = (0, drizzle_orm_1.relations)(exports.member, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        watchlist: one(exports.watchlist, {
            fields: [exports.member.watchlistId],
            references: [exports.watchlist.id],
        }),
        user: one(auth_schema_1.user, {
            fields: [exports.member.userId],
            references: [auth_schema_1.user.id],
        }),
        watched: many(exports.watched),
    });
});
exports.like = (0, pg_core_1.pgTable)("watchlist_like", function (t) { return ({
    watchlistId: t.uuid("watchlist_id").notNull(),
    userId: t.text("user_id").notNull(),
}); }, function (t) { return ({
    pk: (0, pg_core_1.primaryKey)({ columns: [t.watchlistId, t.userId] }),
    watchlistIdx: (0, pg_core_1.index)("like_watchlist_idx").on(t.watchlistId),
    userIdx: (0, pg_core_1.index)("like_user_idx").on(t.userId),
}); });
exports.likeRelations = (0, drizzle_orm_1.relations)(exports.like, function (_a) {
    var one = _a.one;
    return ({
        watchlist: one(exports.watchlist, {
            fields: [exports.like.watchlistId],
            references: [exports.watchlist.id],
        }),
        user: one(auth_schema_1.user, {
            fields: [exports.like.userId],
            references: [auth_schema_1.user.id],
        }),
    });
});
exports.watched = (0, pg_core_1.pgTable)("watched", function (t) { return ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    watchlistId: t.uuid("watchlist_id").notNull(),
    userId: t.text("user_id").notNull(),
    memberId: t.uuid("member_id").notNull(),
    entryId: t.uuid("entry_id").notNull(),
    createdAt: t.timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}); });
exports.watchedRelations = (0, drizzle_orm_1.relations)(exports.watched, function (_a) {
    var one = _a.one;
    return ({
        watchlist: one(exports.watchlist, {
            fields: [exports.watched.watchlistId],
            references: [exports.watchlist.id],
        }),
        member: one(exports.member, {
            fields: [exports.watched.memberId],
            references: [exports.member.id],
        }),
        entry: one(exports.entry, {
            fields: [exports.watched.entryId],
            references: [exports.entry.id],
        }),
        user: one(auth_schema_1.user, {
            fields: [exports.watched.userId],
            references: [auth_schema_1.user.id],
        }),
    });
});
exports.CreatePostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.Post, {
    title: zod_1.z.string().max(256),
    content: zod_1.z.string().max(256),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
__exportStar(require("./auth-schema"), exports);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
