import Link from "next/link";

export default function Footer() {
	return (
		<p className="text-xs leading-0 mt-8 text-neutral-500">
			By clicking continue, you acknowledge that you have read and agree to
			Serea's{" "}
			<Link href={"/terms-of-service"}>
				<span className="hover:text-black underline cursor-pointer">
					Terms of Service
				</span>
			</Link>{" "}
			and{" "}
			<Link href={"/privacy-policy"} target="_blank">
				<span className="hover:text-black underline cursor-pointer">
					Privacy Policy
				</span>
			</Link>
			.
		</p>
	);
}
