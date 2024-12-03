import { and, eq, isNull } from "@serea/db";
import { comment } from "@serea/db/schema";
import { withCursorPagination } from "drizzle-pagination";
import { nanoid } from "nanoid";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateCommentInput,
	DeleteCommentInput,
	GetCommentsInput,
} from "./comments.input";

export const getComments = async (
	ctx: ProtectedTRPCContext,
	{ limit = 10, ...rest }: GetCommentsInput,
) => {
	const { watchlistId, cursor } = rest;

	const comments = await ctx.db.query.comment.findMany({
		...withCursorPagination({
			limit,
			cursors: [
				[comment.createdAt, "desc", cursor ? new Date(cursor) : undefined],
			],
			where: and(
				eq(comment.watchlistId, watchlistId),
				isNull(comment.parentId),
			),
		}),
		with: {
			user: true,
			replies: {
				where: (comments, { eq }) => eq(comments.parentId, comments.id),
			},
		},
	});

	return {
		comments,
		nextCursor: comments.length
			? comments[comments.length - 1]?.createdAt
			: null,
	};
};

export const createComment = async (
	ctx: ProtectedTRPCContext,
	input: CreateCommentInput,
) => {
	const currentUserId = ctx.session.user.id;

	return await ctx.db.insert(comment).values({
		id: nanoid(),
		userId: currentUserId,
		...input,
	});
};

export const deleteComment = async (
	ctx: ProtectedTRPCContext,
	input: DeleteCommentInput,
) => {
	return await ctx.db
		.delete(comment)
		.where(
			and(
				eq(comment.id, input.commentId),
				eq(comment.userId, ctx.session.user.id),
			),
		);
};
