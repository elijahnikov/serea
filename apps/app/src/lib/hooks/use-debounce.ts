import { useCallback, useEffect, useState } from "react";

function useDebounce<T>(valueOrFn: T | (() => void), delay = 500) {
	if (typeof valueOrFn === "function") {
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		return useCallback(debounce(valueOrFn as () => void, delay), [delay]);
	}

	const [debouncedValue, setDebouncedValue] = useState<T>(valueOrFn as T);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(valueOrFn as T);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [valueOrFn, delay]);

	return debouncedValue;
}

function debounce(fn: () => void, delay: number) {
	let timeoutId: NodeJS.Timeout;
	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(), delay);
	};
}

export default useDebounce;
