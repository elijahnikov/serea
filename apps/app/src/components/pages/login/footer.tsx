import Link from "next/link";

export default function Footer() {
	return (
		<p className="text-xs leading-0 mt-8 text-neutral-500">
			By clicking continue, you acknowledge that you have read and agree to
			Serea's{" "}
			<Link href={"#"}>
				<span className="hover:text-black dark:hover:text-white underline cursor-pointer">
					Terms of Service
				</span>
			</Link>{" "}
			and{" "}
			<Link href={"#"} target="_blank">
				<span className="hover:text-black dark:hover:text-white underline cursor-pointer">
					Privacy Policy
				</span>
			</Link>
			.
		</p>
	);
}
