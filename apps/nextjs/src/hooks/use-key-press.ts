import { useEffect, useCallback } from "react";

type KeyType = string | Array<string>;
type KeyPressCallback = (event: KeyboardEvent) => void;

interface UseKeyPressOptions {
	modifiers?: {
		ctrl?: boolean;
		shift?: boolean;
		alt?: boolean;
		meta?: boolean;
	};
	target?: Window | HTMLElement;
	enabled?: boolean;
}

const useKeyPress = (
	key: KeyType,
	callback: KeyPressCallback,
	options: UseKeyPressOptions = {},
) => {
	const { modifiers = {}, target = window, enabled = true } = options;

	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			const keys = Array.isArray(key) ? key : [key];
			const matchesKey = keys.includes(event.key);

			const matchesModifiers =
				(!modifiers.ctrl || event.ctrlKey) &&
				(!modifiers.shift || event.shiftKey) &&
				(!modifiers.alt || event.altKey) &&
				(!modifiers.meta || event.metaKey);

			if (matchesKey && matchesModifiers) {
				callback(event);
			}
		},
		[key, callback, modifiers],
	);

	useEffect(() => {
		if (!enabled) return;

		target.addEventListener("keydown", handleKeyPress as EventListener);

		return () => {
			target.removeEventListener("keydown", handleKeyPress as EventListener);
		};
	}, [target, enabled, handleKeyPress]);
};

export default useKeyPress;
