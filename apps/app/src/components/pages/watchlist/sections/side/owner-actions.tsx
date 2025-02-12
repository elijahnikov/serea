import { Button } from "@serea/ui/button";
import { PlusIcon, SettingsIcon } from "lucide-react";

export default function OwnerActions() {
	return (
		<div className="mt-auto border-b px-8 pb-6 -mx-8 justify-end items-end self-end">
			<div className="flex items-center gap-2">
				<Button before={<PlusIcon />} className="w-full">
					Invite members
				</Button>
				<Button isIconOnly variant="outline">
					<SettingsIcon />
				</Button>
			</div>
		</div>
	);
}
