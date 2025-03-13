import { auth } from "@serea/auth";
import { Suspense } from "react";
import Event from "~/components/pages/event";
import { HydrateClient, api } from "~/trpc/server";

export default async function EventPage({
	params,
}: { params: Promise<{ id: string; eventId: string }> }) {
	const { id, eventId } = await params;
	const user = await auth();

	void api.watchEvent.getEvent.prefetch({
		eventId,
		watchlistId: id,
	});

	return (
		<HydrateClient>
			<Suspense fallback={<div>Loading...</div>}>
				<Event
					eventId={eventId}
					watchlistId={id}
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					currentUserId={user?.user.id!}
				/>
			</Suspense>
		</HydrateClient>
	);
}
