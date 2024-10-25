import { ToggleGroup, ToggleGroupItem } from "@serea/ui/toggle-group";
import { Grid, Rows3 } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const VIEW_STORAGE_KEY = "selected-view";

export default function ViewToggle({
	selectedView,
	setSelectedView,
}: {
	selectedView: string;
	setSelectedView: (view: string) => void;
}) {
	const viewMap = [
		{
			label: "Grid",
			value: "grid",
			icon: <Grid size={14} />,
		},
		{
			label: "Row",
			value: "row",
			icon: <Rows3 size={14} />,
		},
	];

	useEffect(() => {
		const savedView = Cookies.get(VIEW_STORAGE_KEY);
		setSelectedView(savedView || "grid");
	}, [setSelectedView]);

	const handleViewChange = (value: string) => {
		setSelectedView(value);
		Cookies.set(VIEW_STORAGE_KEY, value);
	};

	if (selectedView === null) {
		return null;
	}

	return (
		<div className="py-2">
			<ToggleGroup
				defaultValue={selectedView}
				value={selectedView}
				onValueChange={(value) => {
					if (value) handleViewChange(value);
				}}
				className="border-none"
				size="sm"
				type="single"
			>
				{viewMap.map((view) => (
					<ToggleGroupItem
						key={view.value}
						value={view.value}
						before={view.icon}
					/>
				))}
			</ToggleGroup>
		</div>
	);
}
