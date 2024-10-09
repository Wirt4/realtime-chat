import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'

interface handleSubmitInterface{
    data: FormData,
    showSuccessState(status: boolean): void
}

export class Submissions{
    static handleSubmit(submission: handleSubmitInterface){
        this.addFriend(submission)
    }

    static addFriend(submission: handleSubmitInterface){}
}