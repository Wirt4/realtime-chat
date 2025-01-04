import {authOptions} from "@/lib/auth";
import {AdapterUser} from "next-auth/adapters";

describe('authOptions callbacks - session', () => {
    const sessionCallback = authOptions.callbacks?.session

    test('sets session user details from token', async () => {
        if (!sessionCallback){
            throw new Error('sessionCallback is not defined')
        }
        const session = { user: {id:''}, expires: '' }
        const token = {
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'profile-pic.jpg',
        }

        const result = await sessionCallback({ session, token, user: {id:'', email:'', emailVerified: new Date()}, newSession: null, trigger: 'update' })
        const user = result?.user as { id: string; name?: string | null; email?: string | null; image?: string | null };

        expect(user.id).toBe('123')
        expect(user.name).toBe('John Doe')
        expect(user.email).toBe('john@example.com')
        expect(user.image).toBe('profile-pic.jpg')
    })
})
