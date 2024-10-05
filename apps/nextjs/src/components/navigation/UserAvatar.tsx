export default function UserAvatar({
	avatar,
}: { avatar: { image?: string | null; name?: string | null } }) {
	return (
		<AvatarRoot>
			<AvatarImage
				src={session.user.image ?? undefined}
				alt={`Navigation profile picture for ${session.user.name}`}
			/>
			<AvatarFallback>
				{session.user.name?.charAt(0).toLocaleUpperCase()}
			</AvatarFallback>
		</AvatarRoot>
	);
}
