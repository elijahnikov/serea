import { Suspense } from "react";

import { api, HydrateClient } from "~/trpc/server";

export default function HomePage() {
	// You can await this here if you don't want to show Suspense fallback below
	void api.post.all.prefetch();

	return (
		<HydrateClient>
			<main className="container h-screen py-16">
				<div className="flex flex-col items-center justify-center gap-4">
					123
				</div>
			</main>
		</HydrateClient>
	);
}
