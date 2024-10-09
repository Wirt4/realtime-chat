import {z} from 'zod'
//needs tests?
export const addFriendValidator = z.object({
    email: z.string().email()
})


export type FormData = z.infer<typeof addFriendValidator>;