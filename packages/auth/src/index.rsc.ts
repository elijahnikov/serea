import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

export const getSession = async () => cache(auth.api.getSession)({
    headers: headers()
});

export * from "./auth";