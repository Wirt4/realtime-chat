import {getGoogleCredentials} from "@/lib/auth";


describe('getGoogleCredentials', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.resetModules() // Clears any cache between tests
        process.env = { ...originalEnv }
    })

    afterEach(() => {
        process.env = originalEnv // Reset environment variables after each test
    })

    test('returns credentials when environment variables are set', () => {
        process.env.GOOGLE_CLIENT_ID = 'test-client-id'
        process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'

        const credentials = getGoogleCredentials()

        expect(credentials).toEqual({
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
        })
    })

    test('throws error when GOOGLE_CLIENT_ID is missing', () => {
        process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
        delete process.env.GOOGLE_CLIENT_ID

        expect(() => getGoogleCredentials()).toThrow('Missing GOOGLE_CLIENT_ID')
    })

    test('throws error when GOOGLE_CLIENT_SECRET is missing', () => {
        process.env.GOOGLE_CLIENT_ID = 'test-client-id'
        delete process.env.GOOGLE_CLIENT_SECRET

        expect(() => getGoogleCredentials()).toThrow('Missing GOOGLE_CLIENT_SECRET')
    })
})
