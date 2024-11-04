import Link from "next/link";
import { Paths } from "~/lib/constants";

export default function Footer() {
	return (
		<p className="text-xs leading-0 mt-8 text-neutral-500">
			By clicking continue, you acknowledge that you have read and agree to
			Serea's{" "}
			<Link href={Paths.TermsOfService}>
				<span className="hover:text-black underline cursor-pointer">
					Terms of Service
				</span>
			</Link>{" "}
			and{" "}
			<Link href={Paths.PrivacyPolicy} target="_blank">
				<span className="hover:text-black underline cursor-pointer">
					Privacy Policy
				</span>
			</Link>
			.
		</p>
	);
}
