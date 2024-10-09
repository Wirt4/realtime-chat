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

    static validate(email: string){
        return addFriendValidator.parse(email)
    }

    static async postToAxios(route: string, options: AbortController){
        return axios.post(route, options)
    }

    static async addFriend(props: SubmissionProps){
        try{
            await this.postToAxios("/api/friends/add",{email: this.validate(props.data.email)})
            props.showSuccessState(true)
        }catch(error){}
    }
}