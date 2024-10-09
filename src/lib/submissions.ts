import { addFriendValidator } from '@/lib/validations/add-friend'

type FormData = z.infer<typeof addFriendValidator>
import { z } from 'zod'
import axios from "axios";
import React from "react";

interface SubmissionProps {
    data: FormData
    showSuccessState:(state: boolean) => void
}
export class Submissions{
    handleSubmit(props: React.FormEvent<HTMLFormElement>): void{
        this.addFriend(props)
    }

    validate(email: string){
        return addFriendValidator.parse(email)
    }

    async postToAxios(route: string, options: AbortController){
        return axios.post(route, options)
    }

    async addFriend(props: SubmissionProps){
        try{
            await this.postToAxios("/api/friends/add",{email: this.validate(props.data.email)})
            props.showSuccessState(true)
        }catch(error){}
    }
}