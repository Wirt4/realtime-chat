import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'

export class Submissions{
    static handleSubmit(data: FormData){
        this.addFriend(data.email)
    }

    static addFriend(email: string){}
}