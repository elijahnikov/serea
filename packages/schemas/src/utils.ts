// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type QueryReturnType<T extends (...args: any) => any> = Awaited<
	ReturnType<T>
>;
