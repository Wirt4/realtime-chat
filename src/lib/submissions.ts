import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'

interface SubmissionProps {
    data: FormData
    showSuccessState:(state: boolean) => void
}
export class Submissions{
    static handleSubmit(props: SubmissionProps): void{
        this.addFriend(props)
    }

    static addFriend(props: SubmissionProps){
        props.showSuccessState(true)
    }
}