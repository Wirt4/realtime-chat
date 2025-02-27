import { NextAuthOptions } from 'next-auth'
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import fetchRedis from '@/helpers/redis'
import QueryBuilder from "@/lib/queryBuilder";

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

const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/api/auth/signin',
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log('jwt called with', token, user);
            const dbUserResult = (await fetchRedis('get', QueryBuilder.user(token.id))) as
                | string
                | null

            if (!dbUserResult) {
                if (user) {
                    token.id = user!.id
                }

                return token
            }

            const dbUser = JSON.parse(dbUserResult) as User

            console.log('returning dbUser', dbUser)
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
        async session({ session, token }) {
            console.log('session called with', session, token);
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            console.log('returning session', session);
            return session
        },
        redirect({ url, baseUrl }) {
            console.log('redirect called with', url, baseUrl);
            console.log('returning', url.startsWith(baseUrl) ? url : baseUrl + '/login');
            return url.startsWith(baseUrl) ? url : baseUrl + '/login';
        },
    },
}

export { getGoogleCredentials, authOptions }
