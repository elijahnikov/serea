import type { Config } from "tailwindcss";

import baseConfig from "@serea/tailwind-config/web";

export default {
	content: [
		...baseConfig.content,
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	presets: [baseConfig],
	plugins: [],
} satisfies Config;
