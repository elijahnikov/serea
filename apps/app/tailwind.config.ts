import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

import baseConfig from "@serea/tailwind-config/web";
import { fontFamily } from "tailwindcss/defaultTheme";

export default withUt({
	content: [
		...baseConfig.content,
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	presets: [baseConfig],
	theme: {
		fontFamily: {
			serif: ["Instrument Serif", ...fontFamily.serif],
			mono: ["JetBrains Mono", ...fontFamily.mono],
		},
	},
	plugins: [],
}) satisfies Config;
