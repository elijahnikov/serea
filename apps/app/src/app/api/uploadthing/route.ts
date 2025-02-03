import { createRouteHandler } from "uploadthing/next";
import { utFileRouter } from "./core";
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
	router: utFileRouter,
	// Apply an (optional) custom config:
	// config: { ... },
});
