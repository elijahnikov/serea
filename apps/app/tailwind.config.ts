import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import {
	wedgesPalette,
	wedgesTW,
	type ThemableColorScale,
} from "@lemonsqueezy/wedges";

import baseConfig from "@serea/tailwind-config/web";

const primaryBlack: ThemableColorScale = { ...wedgesPalette.black };
export default {
	// We need to append the path to the UI package to the content array so that
	// those classes are included correctly.
	content: [...baseConfig.content, "../../packages/ui/src/*.{ts,tsx}"],
	presets: [baseConfig],
	theme: {
		extend: {
			fontFamily: {
				lora: ["Lora", ...fontFamily.sans],
				heading: ["EB Garamond", ...fontFamily.sans],
				rounded: ["Varela Round", ...fontFamily.sans],
				sans: ["var(--font-sans)", ...fontFamily.sans],
				mono: ["var(--font-geist-mono)", ...fontFamily.mono],
			},
		},
	},
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
