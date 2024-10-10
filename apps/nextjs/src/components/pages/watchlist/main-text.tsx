import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import { Clock, RotateCw } from "lucide-react";
import moment from "moment";

export default function MainText({
	title,
	createdAt,
	updatedAt,
	description,
}: NonNullable<RouterOutputs["watchlist"]["get"]>) {
	return (
		<>
			<p className="font-semibold tracking-tight text-neutral-800 text-balance text-2xl mt-2">
				{title}
			</p>
			<div className="flex items-center my-2 space-x-2">
				<Badge stroke>
					<div className="flex items-center space-x-1">
						<Clock size={12} className="text-neutral-500" />
						<p className="text-xs font-medium text-neutral-500">
							Created{" "}
							<span className="text-black">
								{moment(createdAt).format("MMMM Do YYYY")}
							</span>
						</p>
					</div>
				</Badge>
				<Badge stroke>
					<div className="flex items-center space-x-1">
						<RotateCw size={12} className="text-neutral-500" />
						<p className="text-xs font-medium text-neutral-500">
							Last updated{" "}
							<span className="text-black">
								{moment(updatedAt).format("MMMM Do YYYY")}
							</span>
						</p>
					</div>
				</Badge>
			</div>
			<p className=" text-neutral-500 mt-2 mb-4 text-md">{description}</p>
		</>
	);
}
