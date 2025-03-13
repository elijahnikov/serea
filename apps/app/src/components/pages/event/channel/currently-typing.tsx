import type { RouterOutputs } from "@serea/api";

import { listWithAnd, pluralize } from "./chat";

export default function CurrentlyTyping({
	typing,
}: {
	typing: string[];
}) {
	return (
		<div className="text-sm font-medium text-carbon-900">
			{typing?.length ? (
				`${listWithAnd(typing)} ${pluralize(
					typing.length,
					"is",
					"are",
				)} typing...`
			) : (
				<>&nbsp;</>
			)}
		</div>
	);
}
