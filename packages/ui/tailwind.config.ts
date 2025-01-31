import baseConfig from "@serea/tailwind-config/web";
import type { Config } from "tailwindcss";

export default {
	content: [...baseConfig.content, "../../packages/ui/src/*.{ts,tsx}"],
	presets: [baseConfig],
	plugins: [],
} satisfies Config;
