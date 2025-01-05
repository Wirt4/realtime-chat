import { authOptions } from '@/lib/auth'
import fetchRedis from '@/helpers/redis'
import {JWT} from "next-auth/jwt";

jest.mock('@/helpers/redis')

describe('authOptions callbacks - jwt', () => {
    const jwtCallback = authOptions.callbacks?.jwt
    if (!jwtCallback) {
        throw new Error('jwtCallback is not defined')
    }

    test('returns token with user id when user is not found in Redis', async () => {
        const token = { id: '123' };
        const user = { id: '456' };

        (fetchRedis as jest.Mock).mockResolvedValue(null); // Simulate no user in Redis

        const result = await jwtCallback({ token, user, account:null });

        expect(result.id).toBe('456'); // The user id is set from the user object
    })

    test('returns token with data from Redis when user is found', async () => {
        const token = { id: '123', name:'', email:'', picture:'' };
        const dbUser = {
            id: '789',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'profile-pic.jpg',
        };

        (fetchRedis as jest.Mock).mockResolvedValue(JSON.stringify(dbUser)); // Simulate user found in Redis

        const result = await jwtCallback({ token, user: dbUser, account:null });

        expect(result).toEqual({
            id: '789',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'profile-pic.jpg',
        });
    });
});
