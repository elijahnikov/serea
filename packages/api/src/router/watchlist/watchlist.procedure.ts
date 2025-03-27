import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watchlist.input";
import * as services from "./watchlist.service";

export const watchlistRouter = {
	// QUERIES
	get: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist" })
		.query(async ({ ctx, input }) => services.getWatchlist(ctx, input)),

	getEntries: protectedProcedure
		.input(inputs.getWatchlistEntries)
		.meta({ name: "get-watchlist-entries" })
		.query(async ({ ctx, input }) => services.getWatchlistEntries(ctx, input)),

	getMembers: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-members" })
		.query(async ({ ctx, input }) => services.getWatchlistMembers(ctx, input)),

	getComments: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-comments" })
		.query(async ({ ctx, input }) => services.getComments(ctx, input)),

	getInvites: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-invites" })
		.query(async ({ ctx, input }) => services.getInvites(ctx, input)),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.meta({ name: "create-watchlist" })
		.mutation(async ({ ctx, input }) => services.createWatchlist(ctx, input)),

	like: protectedProcedure
		.input(inputs.likeWatchlist)
		.meta({ name: "like-watchlist" })
		.mutation(async ({ ctx, input }) => services.likeWatchlist(ctx, input)),

	addEntry: protectedProcedure
		.input(inputs.addWatchlistEntry)
		.meta({ name: "add-watchlist-entry" })
		.mutation(async ({ ctx, input }) => services.addEntry(ctx, input)),

	deleteEntry: protectedProcedure
		.input(inputs.deleteEntry)
		.meta({ name: "delete-entry" })
		.mutation(async ({ ctx, input }) => services.deleteEntry(ctx, input)),

	updateEntryOrder: protectedProcedure
		.input(inputs.updateEntryOrder)
		.meta({ name: "update-entry-order" })
		.mutation(async ({ ctx, input }) => services.updateEntryOrder(ctx, input)),

	createComment: protectedProcedure
		.input(inputs.createComment)
		.meta({ name: "create-comment" })
		.mutation(async ({ ctx, input }) => services.createComment(ctx, input)),

	deleteComment: protectedProcedure
		.input(inputs.deleteComment)
		.meta({ name: "delete-comment" })
		.mutation(async ({ ctx, input }) => services.deleteComment(ctx, input)),

	likeComment: protectedProcedure
		.input(inputs.likeComment)
		.meta({ name: "like-comment" })
		.mutation(async ({ ctx, input }) => services.likeComment(ctx, input)),

	inviteMembers: protectedProcedure
		.input(inputs.inviteMembers)
		.meta({ name: "invite-members" })
		.mutation(async ({ ctx, input }) => services.inviteMembers(ctx, input)),

	respondInvite: protectedProcedure
		.input(inputs.respondInvite)
		.meta({ name: "respond-invite" })
		.mutation(async ({ ctx, input }) => services.respondInvite(ctx, input)),

	deleteInvite: protectedProcedure
		.input(inputs.deleteInvite)
		.meta({ name: "delete-invite" })
		.mutation(async ({ ctx, input }) => services.deleteInvite(ctx, input)),

	updateMemberRole: protectedProcedure
		.input(inputs.updateMemberRole)
		.meta({ name: "update-member-role" })
		.mutation(async ({ ctx, input }) => services.updateMemberRole(ctx, input)),

	deleteMember: protectedProcedure
		.input(inputs.deleteMember)
		.meta({ name: "delete-member" })
		.mutation(async ({ ctx, input }) => services.deleteMember(ctx, input)),

	editWatchlist: protectedProcedure
		.input(inputs.editWatchlist)
		.meta({ name: "edit-watchlist" })
		.mutation(async ({ ctx, input }) => services.editWatchlist(ctx, input)),

	deleteWatchlist: protectedProcedure
		.input(inputs.deleteWatchlist)
		.meta({ name: "delete-watchlist" })
		.mutation(async ({ ctx, input }) => services.deleteWatchlist(ctx, input)),
} satisfies TRPCRouterRecord;
