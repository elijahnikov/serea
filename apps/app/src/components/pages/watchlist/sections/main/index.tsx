import type { RouterOutputs } from "@serea/api";
import { ListIcon } from "lucide-react";
import MainHeader from "./header";

export default function MainSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	return (
		<div className="flex lg:mt-0 mt-8 max-w-[calc(100%-240px)] flex-col ">
			<div className="border-b h-max px-8 py-6">
				<div className="flex items-center gap-2 mb-2 text-carbon-900">
					<ListIcon className="w-4 h-4" />
					<p className="font-mono text-xs">WATCHLIST</p>
				</div>
				<MainHeader watchlist={watchlist} />
			</div>
			<div className="px-8 border-b py-6">
				<p>1</p>
				<div className="h-[200px]">1</div>
			</div>
		</div>
	);
}
