import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateWatchEventInput,
	DeleteWatchEventInput,
	GetWatchEventForWatchlistInput,
} from "./watch-event.input";

export const createWatchEvent = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchEventInput,
) => {
	const currentUserId = ctx.session.user.id;

	const startDate = new Date(input.date);
	const endDate = new Date(startDate.getTime() + input.runtime * 60 * 1000);

	const existingEvents = await ctx.db.watchEvent.findMany({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId, // Filter by the same watchlist
		},
		include: {
			entry: {
				include: {
					movie: true,
				},
			},
		},
	});

	const overlappingEvents = existingEvents.filter((event) => {
		const eventStartDate = new Date(event.date);

		const eventRuntime = event.entry.movie.runtime ?? 120;
		const eventEndDate = new Date(
			eventStartDate.getTime() + eventRuntime * 60 * 1000,
		);

		return eventStartDate < endDate && eventEndDate > startDate;
	});

	if (overlappingEvents.length > 0) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"This watch event overlaps with an existing event in this watchlist",
		});
	}

	const event = await ctx.db.watchEvent.create({
		data: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			date: input.date,
		},
	});

	return event;
};

export const deleteWatchEvent = async (
	ctx: ProtectedTRPCContext,
	input: DeleteWatchEventInput,
) => {
	await ctx.db.watchEvent.delete({
		where: {
			id: input.id,
		},
	});
};

export const getEventsForWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchEventForWatchlistInput,
) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const events = await ctx.db.watchEvent.findMany({
		where: {
			watchlistId: input.watchlistId,
			date: {
				gte: today,
				lt: tomorrow,
			},
		},
	});

	return events;
};
