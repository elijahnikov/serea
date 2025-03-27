import { Button } from "@serea/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import { DropdownMenuItem } from "@serea/ui/dropdown-menu";
import { LoadingButton } from "@serea/ui/loading-button";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export function DeleteDialog({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const router = useRouter();
	const deleteWatchlist = api.watchlist.deleteWatchlist.useMutation({
		onSuccess: () => {
			router.push("/watchlists");
		},
	});
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()} destructive>
					<TrashIcon />
					<span>Delete watchlist</span>
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription className="leading-4">
						This action cannot be undone. This will permanently delete your
						watchlist and remove your watch progress and any events created.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline">Cancel</Button>
					<LoadingButton
						loading={deleteWatchlist.isPending}
						before={<TrashIcon />}
						variant="destructive"
						onClick={() => deleteWatchlist.mutate({ watchlistId })}
					>
						Delete
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
