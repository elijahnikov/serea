export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="grid min-h-screen min-w-screen p-4">{children}</div>;
}
