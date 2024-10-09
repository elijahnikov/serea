"use server";

import { auth } from "@serea/auth";
import { redirect } from "next/navigation";

import SingleWatchlist from "~/components/pages/watchlist/single-watchlist";
import { api } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const watchlist = await api.watchlist.get({ id: params.id });
	if (!watchlist) {
		redirect("/404");
	}
	const session = await auth();
	if (watchlist.isPrivate && session?.user.id !== watchlist.userId) {
		return redirect("/404");
	}
	const isOwner = watchlist.user.id === session?.user.id;

	return <SingleWatchlist isOwner={isOwner} watchlist={watchlist} />;
}
