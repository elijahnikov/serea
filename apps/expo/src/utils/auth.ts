import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'


export const authClient = createAuthClient({
    plugins: [expoClient({
        scheme: "expo"
    })],
    baseURL: "http://localhost:3000",
    disableDefaultFetchPlugins: true
})

export const { signIn, signOut } = authClient