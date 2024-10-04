import { auth } from "@serea/auth";
import {
	AvatarWedges as Avatar,
	AvatarRoot,
	AvatarImage,
	AvatarFallback,
} from "@serea/ui/avatar";
import Link from "next/link";

export default async function Navigation() {
	const session = await auth();
	return (
		<div className="w-16 bg-white flex items-center flex-col py-4 border border-surface-100 shadow-wg-xs">
			<Link href={"/"} className="active:scale-[0.85] duration-200 scale-100">
				<img className="h-12 w-12" src="/logo.png" alt="Serea logo" />
			</Link>
			<div>
				{session?.user.image ? (
					<AvatarRoot>
						<AvatarImage
							src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop"
							alt="Image alt text"
						/>
						<AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
					</AvatarRoot>
				) : null}
			</div>
		</div>
	);
}
