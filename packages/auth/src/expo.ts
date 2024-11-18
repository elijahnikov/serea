import { createAuthClient } from 'better-auth/react'
import { expoClient } from '@better-auth/expo/client'
import { env } from '../env'


export const authClient = createAuthClient({
    plugins: [expoClient({
        scheme: "expo" // change this to your app's scheme
    })],
    baseURL: env.AUTH_DISCORD_ID,
})

export const { signIn, signOut } = authClient