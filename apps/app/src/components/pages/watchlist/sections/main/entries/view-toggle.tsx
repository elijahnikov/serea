"use client";

import { ButtonGroup, ButtonGroupItem } from "@serea/ui/button-group";
import { cn } from "@serea/ui/cn";
import { GridIcon, ListIcon } from "lucide-react";
import { SELECTED_VIEW_COOKIE_NAME } from "~/lib/constants";

export default function ViewToggle({
	selectedView,
	setSelectedView,
}: {
	selectedView: "grid" | "list";
	setSelectedView: (view: "grid" | "list") => void;
}) {
	const handleViewSelect = (view: "grid" | "list") => {
		setSelectedView(view);
		localStorage.setItem(SELECTED_VIEW_COOKIE_NAME, view);
	};

	return (
		<div>
			<ButtonGroup size="sm">
				<ButtonGroupItem
					variant="outline"
					isIconOnly
					onClick={() => handleViewSelect("grid")}
				>
					<GridIcon
						className={cn(
							"w-4 h-4",
							selectedView === "grid" ? "text-white" : "text-carbon-900/75",
						)}
					/>
				</ButtonGroupItem>
				<ButtonGroupItem
					variant="outline"
					isIconOnly
					onClick={() => handleViewSelect("list")}
				>
					<ListIcon
						className={cn(
							"w-4 h-4",
							selectedView === "list" ? "text-white" : "text-carbon-900/75",
						)}
					/>
				</ButtonGroupItem>
			</ButtonGroup>
		</div>
	);
}
