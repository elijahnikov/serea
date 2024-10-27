import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import withPlaiceholder from "@plaiceholder/next";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@serea/api",
		"@serea/auth",
		"@serea/db",
		"@serea/ui",
		"@serea/validators",
	],
	images: {
		remotePatterns: [
			{ hostname: "image.tmdb.org" },
			{ hostname: "cdn.discordapp.com" },
			{ hostname: "lh3.googleusercontent.com" },
		],
	},
	/** We already do linting and typechecking as separate tasks in CI */
	typescript: { ignoreBuildErrors: true },
};

export default withPlaiceholder(config);
