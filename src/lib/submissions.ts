import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'

export class Submissions{
    static handleSubmit(data: FormData, showSuccessState:(status: boolean)=>void): void{
        this.addFriend(data, showSuccessState)
    }

    static addFriend(data: FormData, showSuccessState:(status: boolean)=>void){
        showSuccessState(true)
    }
}