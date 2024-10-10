import { authOptions } from '@/lib/auth'
import fetchRedis from '@/helpers/redis'

jest.mock('../../../src/helpers/redis')

describe('authOptions callbacks - jwt', () => {
    const jwtCallback = authOptions.callbacks.jwt

    test('returns token with user id when user is not found in Redis', async () => {
        const token = { id: '123' }
        const user = { id: '456' }

        fetchRedis.mockResolvedValue(null) // Simulate no user in Redis

        const result = await jwtCallback({ token, user })

        expect(result.id).toBe('456') // The user id is set from the user object
    })

    test('returns token with data from Redis when user is found', async () => {
        const token = { id: '123' }
        const dbUser = {
            id: '789',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'profile-pic.jpg',
        }

        fetchRedis.mockResolvedValue(JSON.stringify(dbUser)) // Simulate user found in Redis

        const result = await jwtCallback({ token })

        expect(result).toEqual({
            id: '789',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'profile-pic.jpg',
        })
    })
})
