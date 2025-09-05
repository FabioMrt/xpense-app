"use client"

import { SessionProviderProps, SessionProvider } from "next-auth/react"


export const AuthProvider = ({children} : SessionProviderProps) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

