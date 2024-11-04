import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import Label from "@serea/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import type { watchlistCreateSchema } from "../../../../../../packages/schemas/src";

export default function ShareAccess({
	form,
}: { form: UseFormReturn<z.infer<typeof watchlistCreateSchema>> }) {
	return (
		<div className="w-full">
			<div>
				<Label className="mb-2">Share access</Label>
				<Dialog>
					<DialogTrigger>Open</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
