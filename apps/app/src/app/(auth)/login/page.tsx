import { redirect } from "next/navigation";
import { Paths } from "../../../lib/constants";
import { auth } from "@serea/auth";
import { Login } from "~/components/pages/auth/login/login";

export const metadata = {
	title: "Login",
	description: "Login Page",
};

export default async function LoginPage() {
	const session = await auth();

	if (session) redirect(Paths.Home);

	return <Login />;
}
