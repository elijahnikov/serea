import { cx } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

const isElementWithChildren = (
	element: React.ReactNode,
): element is React.ReactElement<{ children?: React.ReactNode }> => {
	return (
		React.isValidElement(element) &&
		typeof (element as React.ReactElement<{ children?: React.ReactNode }>).props
			.children !== "undefined"
	);
};

const isReactElement = (
	element: React.ReactNode,
): element is React.ReactElement => {
	return React.isValidElement(element);
};

export { cn, isElementWithChildren, isReactElement };
