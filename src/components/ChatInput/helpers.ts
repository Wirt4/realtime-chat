import React from "react";
import axios, {AxiosError} from "axios";
import {toast} from "react-hot-toast";

interface StateSetters {
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>
    setInput : React.Dispatch<React.SetStateAction<string>>
    reference:  React.MutableRefObject<HTMLTextAreaElement | null>
}

export default class Helpers{
    setters : StateSetters
    chatId: string
    endpoint: string = '/api/message/send'

    constructor( setters: StateSetters, chatId: string) {
        this.setters = setters;
        this.chatId = chatId
    }

    isUnShiftedEnter(event: React.KeyboardEvent<HTMLTextAreaElement>){
        return event.key === "Enter" && !event.shiftKey
    }

    HandleKeystroke  (event: React.KeyboardEvent<HTMLTextAreaElement>, input:string) {
        if (this.isUnShiftedEnter(event)) {
            event.preventDefault();
            this.SendMessage(input);
        }
    }

    clearInput(){
        this.setters.setInput('')
    }

    setFocus(){
        this.setters.reference.current?.focus()
    }

   async SendMessage(input: string){
        this.setters.setIsLoading(true)
       try{
           await axios.post(this.endpoint,{text: input, chatId: this.chatId})
           this.clearInput()
           this.setFocus()
       }catch(error){
                toast.error((error as AxiosError)?.message || 'Something went wrong. Try again')
       }finally{
           this.setters.setIsLoading(false)
       }
   }
}
