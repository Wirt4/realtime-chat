import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import fetchRedis from '@/helpers/redis'
import QueryBuilder from "@/lib/queryBuilder";

/**
 * Preconditions: client Secret and client ID exist in the environment variables
 * Postconditions: returns the client ID and client Secret from the environment variables
 * @returns 
 */
const getGoogleCredentials = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return { clientId, clientSecret }
}

/**
 * Is not a function, but a constant that holds the NextAuthOptions object
 */
const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/login',
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            const dbUserResult = (await fetchRedis('get', QueryBuilder.user(token.id))) as
                | string
                | null

            if (!dbUserResult) {
                if (user) {
                    token.id = user?.id
                }

                return token
            }

            const dbUser = JSON.parse(dbUserResult) as User

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;

            // Allow navigation if it's within the same domain
            if (url.startsWith(baseUrl)) return url;

            // Default to home page after login instead of forcing back to '/login'
            return baseUrl;
        },
    },
}

export { getGoogleCredentials, authOptions }
