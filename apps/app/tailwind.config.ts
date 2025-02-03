import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

import baseConfig from "@serea/tailwind-config/web";

export default withUt({
	content: [
		...baseConfig.content,
		"./src/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	presets: [baseConfig],
	plugins: [],
}) satisfies Config;
