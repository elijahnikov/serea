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

	const now = new Date();

	if (new Date(input.date) < now) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Cannot create an event in the past",
		});
	}

	const startDate = new Date(input.date);
	const endDate = new Date(startDate.getTime() + input.runtime * 60 * 1000);

	const existingEvents = await ctx.db.watchEvent.findMany({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
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

	const transaction = await ctx.db.$transaction(async (tx) => {
		const event = await tx.watchEvent.create({
			data: {
				userId: currentUserId,
				watchlistId: input.watchlistId,
				entryId: input.entryId,
				date: input.date,
			},
		});

		await tx.watchEventChannel.create({
			data: {
				watchEventId: event.id,
			},
		});

		return event;
	});

	return transaction;
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
	const now = new Date();

	const today = new Date(now);
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
		include: {
			channel: true,
			entry: {
				include: {
					movie: true,
				},
			},
		},
		orderBy: {
			date: "asc",
		},
	});

	const relevantEvents = events.filter((event) => {
		if (event.date > now) return true;

		const runtime = event.entry.movie.runtime;
		if (runtime) {
			const endTime = new Date(event.date);
			endTime.setMinutes(endTime.getMinutes() + runtime);
			return endTime > now;
		}

		return false;
	});

	return relevantEvents;
};

export const getAllEventsForWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchEventForWatchlistInput,
) => {
	const now = new Date();
	return await ctx.db.watchEvent.findMany({
		where: {
			watchlistId: input.watchlistId,
			date: {
				gte: now,
			},
		},
		include: {
			entry: {
				include: {
					movie: true,
				},
			},
		},
		orderBy: {
			date: "asc",
		},
	});
};
