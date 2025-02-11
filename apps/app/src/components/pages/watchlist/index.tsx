"use client";

import { ListIcon } from "lucide-react";
import { api } from "~/trpc/react";

export default function Watchlist({ id }: { id: string }) {
	const [watchlist] = api.watchlist.get.useSuspenseQuery({
		id,
	});

	return (
		<main className="h-screen">
			<div className="flex max-h-screen overflow-y-auto">
				<div className="flex lg:mt-0 mt-8 max-w-[calc(100%-240px)] flex-col ">
					<div className="border-b h-max px-8 py-6">
						<div className="flex items-center gap-2 mb-2 text-carbon-900">
							<ListIcon className="w-4 h-4" />
							<p className="font-mono text-xs ">WATCHLIST</p>
						</div>

						<h1 className="font-medium text-3xl text-balance">
							{watchlist.title}
						</h1>
						<p className="text-sm text-carbon-900">{watchlist.description}</p>
					</div>
					<div className="px-8 py-6">
						<p>1</p>
						<div className="h-[2000px]">1</div>
					</div>
				</div>
				<div className="fixed overflow-y-auto max-h-screen px-8 py-6 right-0 bg-background min-h-screen min-w-[240px] border-l">
					<p className="text-xs font-mono text-carbon-900">UPLOADED BY</p>
					<div className="h-[2000px]">1</div>
				</div>
			</div>
		</main>
	);
}
