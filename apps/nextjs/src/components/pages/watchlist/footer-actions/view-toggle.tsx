import { cn } from "@serea/ui";
import { ToggleGroup, ToggleGroupItem } from "@serea/ui/toggle-group";
import { Grid, Rows3 } from "lucide-react";
import { useState, useEffect } from "react";

const VIEW_STORAGE_KEY = "selected-view";

export default function ViewToggle() {
	const [selectedView, setSelectedView] = useState<string | null>(null);

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
		const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
		setSelectedView(savedView || "grid");
	}, []);

	const handleViewChange = (value: string) => {
		setSelectedView(value);
		localStorage.setItem(VIEW_STORAGE_KEY, value);
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
