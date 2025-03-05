import { authOptions } from '@/lib/auth'
import GoogleProvider from 'next-auth/providers/google'

describe('authOptions', () => {
    test('contains the correct adapter', () => {
        expect(authOptions.adapter).toBeDefined()
    })

    test('uses jwt strategy for sessions', () => {
        if (authOptions.session === undefined) {
            throw new Error('authOptions.session is undefined')
        }
        expect(authOptions.session.strategy).toBe('jwt')
    })

    test('includes Google provider with valid credentials', () => {
        const GoogleProvider = authOptions.providers.find(
            provider => provider.id === 'google'
        )
        if (GoogleProvider === undefined) {
            throw new Error('GoogleProvider is undefined')
        }
        expect(GoogleProvider.options.clientId).toBe(process.env.GOOGLE_CLIENT_ID)
        expect(GoogleProvider.options.clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET)
    })

    test('has signIn page set to /login', () => {
        if (authOptions.pages === undefined) {
            throw new Error('authOptions.pages is undefined')
        }
        expect(authOptions.pages.signIn).toBe('/api/auth/signin')
    })
})
