import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id_token?: string
            backendToken?: string
            walimurid_profile?: any
            is_registered?: boolean
        } & DefaultSession["user"]
    }

    interface User {
        id_token?: string
        backendToken?: string
        walimurid_profile?: any
        is_registered?: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id_token?: string
        backendToken?: string
        walimurid_profile?: any
        is_registered?: boolean
    }
}
