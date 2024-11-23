"use client";

import { Button } from "@serea/ui/button";
import { PencilLine, X } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@serea/ui/dialog";

import type { RouterOutputs } from "@serea/api";

import EditForm from "./edit-form";
import { useState } from "react";

export default function EditModal({
	watchlist,
}: {
	watchlist: Pick<
		RouterOutputs["watchlist"]["get"],
		"id" | "title" | "description" | "tags" | "isPrivate" | "hideStats"
	>;
}) {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"xs-icon"} variant={"outline"}>
					<div className="flex items-center space-x-1">
						<PencilLine size={16} />
						<p>Edit</p>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="focus:outline-none min-w-[400px] focus:ring-0">
				<EditForm setOpen={setOpen} watchlist={watchlist} />
			</DialogContent>
		</Dialog>
	);
}
