import { api } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const data = await api.watchlist.get({
		id: params.id,
	});
	return <>{params.id}</>;
}
