import {authOptions} from "@/lib/auth";

describe('authOptions callbacks - session', () => {
    const sessionCallback = authOptions.callbacks.session

    test('sets session user details from token', async () => {
        const session = { user: {} }
        const token = {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'profile-pic.jpg',
        }

        const result = await sessionCallback({ session, token })

        expect(result.user.id).toBe('123')
        expect(result.user.name).toBe('John Doe')
        expect(result.user.email).toBe('john@example.com')
        expect(result.user.image).toBe('profile-pic.jpg')
    })
})
