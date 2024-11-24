import { AvatarWedges } from "@serea/ui/avatar";

export default function SereaAvatar({
	url,
	name,
	size,
}: {
	url: string | null;
	name: string;
	size: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) {
	return (
		<AvatarWedges
			alt={`Navigation profile picture for ${name}`}
			size={size}
			src={url ?? undefined}
			initials={name?.charAt(0).toLocaleUpperCase()}
		/>
	);
}
