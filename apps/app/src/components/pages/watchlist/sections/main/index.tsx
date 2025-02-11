import type { RouterOutputs } from "@serea/api";
import { ListIcon } from "lucide-react";
import EntriesSection from "./entries";
import MainHeader from "./header";

export default function MainSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	return (
		<div className="flex lg:mt-0 mt-8 max-w-[calc(100%-240px)] flex-col ">
			<MainHeader watchlist={watchlist} />
			<EntriesSection watchlist={watchlist} />
		</div>
	);
}
