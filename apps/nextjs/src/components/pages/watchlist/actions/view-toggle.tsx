import { ToggleGroup, ToggleGroupItem } from "@serea/ui/toggle-group";
import Cookies from "js-cookie";
import { GridIcon, RowsIcon } from "lucide-react";
import { useEffect } from "react";

const VIEW_STORAGE_KEY = "selected-view";

export default function ViewToggle({
	setSelectedView,
}: {
	setSelectedView: (view: "grid" | "row") => void;
}) {
	useEffect(() => {
		const savedView = Cookies.get(VIEW_STORAGE_KEY);
		setSelectedView((savedView || "grid") as "grid" | "row");
	}, [setSelectedView]);

	const handleViewChange = (value: "grid" | "row") => {
		setSelectedView(value);
		Cookies.set(VIEW_STORAGE_KEY, value);
	};

	return (
		<ToggleGroup
			size="sm"
			orientation="horizontal"
			defaultValue="grid"
			type="single"
			onValueChange={handleViewChange}
		>
			<ToggleGroupItem value="grid" before={<GridIcon />} />
			<ToggleGroupItem value="row" before={<RowsIcon />} />
		</ToggleGroup>
	);
}
