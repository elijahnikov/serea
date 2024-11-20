import type { Config } from "tailwindcss";

import baseConfig from "@serea/tailwind-config/web";
import { wedgesTW, wedgesPalette } from "@lemonsqueezy/wedges";

export default {
	content: [
		...baseConfig.content,
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
		"node_modules/@lemonsqueezy/wedges/dist/**/*.{js,ts,jsx,tsx}",
	],
	presets: [baseConfig],
	plugins: [
		wedgesTW({
			themes: {
				light: {
					colors: {
						primary: {
							...wedgesPalette.gray,
							DEFAULT: "#000000",
						},
					},
				},
			},
		}),
	],
} satisfies Config;
