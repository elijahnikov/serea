import { useEffect, useState, useCallback } from "react";

function useDebounce<T>(valueOrFn: T | (() => void), delay = 500) {
	// If it's a function, handle it differently
	if (typeof valueOrFn === "function") {
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		return useCallback(debounce(valueOrFn as () => void, delay), [delay]);
	}

	// Original value debouncing logic
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

// Helper function to create a debounced function
function debounce(fn: () => void, delay: number) {
	let timeoutId: NodeJS.Timeout;
	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(), delay);
	};
}

export default useDebounce;
