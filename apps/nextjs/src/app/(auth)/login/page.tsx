import { getSession } from "@serea/auth";
import { redirect } from "next/navigation";
import { Login } from "~/components/pages/auth/login";

export default async function LoginPage() {
	const session = await getSession();

	if (session) {
		redirect("/");
	}

	return <Login />;
}
