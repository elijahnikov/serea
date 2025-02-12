import { Button } from "@serea/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import { EllipsisIcon, TrashIcon } from "lucide-react";

export default function CommentDropdown({
	commentId,
	deleteComment,
}: {
	commentId: string;
	deleteComment: () => void;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="p-1" variant="outline" isIconOnly>
					<EllipsisIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={deleteComment}
						className="text-red-500 hover:text-red-600"
					>
						<TrashIcon />
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
