import baseConfig from "@serea/tailwind-config/web";
import type { Config } from "tailwindcss";

export default {
	content: [
		...baseConfig.content,
		"../../packages/ui/src/*.{ts,tsx}",
		"node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
	],
	presets: [baseConfig],
} satisfies Config;
