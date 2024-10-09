import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'
import axios from "axios";

interface SubmissionProps {
    data: FormData
    showSuccessState:(state: boolean) => void
}
export class Submissions{
    static handleSubmit(props: SubmissionProps): void{
        this.addFriend(props)
    }

    static async addFriend(props: SubmissionProps){
        try{
            addFriendValidator.parse(props.data.email)
            await axios.post('some bullshit')
            props.showSuccessState(true)
        }catch(error){}
    }
}