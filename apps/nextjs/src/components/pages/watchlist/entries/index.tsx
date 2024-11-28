import type { RouterOutputs } from "@serea/api";
import EntriesGrid from "./entries-grid";
import EntriesRows from "./entries-rows";

export default function Entries({
	entries,
	view,
	watchlistId,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	view: "grid" | "row";
	watchlistId: string;
}) {
	return (
		<div>
			{view === "grid" ? (
				// biome-ignore lint/a11y/useValidAriaRole: <explanation>
				<EntriesGrid
					watchlistId={watchlistId}
					entries={entries}
					role={"owner"}
				/>
			) : (
				// biome-ignore lint/a11y/useValidAriaRole: <explanation>
				<EntriesRows
					watchlistId={watchlistId}
					entries={entries}
					role={"owner"}
				/>
			)}
		</div>
	);
}
