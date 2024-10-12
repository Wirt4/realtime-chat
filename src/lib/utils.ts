import cslx, {ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import buttonVariants from "@/components/ui/button/buttonVariants"
import {signIn} from "next-auth/react"
import {toast} from "react-hot-toast"
import {UseFormSetError} from "react-hook-form";
import {addFriendValidator} from "@/lib/validations/add-friend";
import {ZodError} from "zod";
import axios, {AxiosError} from "axios";

interface addFriendInterface{
    email: string,
    setError: UseFormSetError<{ email: string; }>,
    setShowSuccessState:(state: boolean) => void
}

export class Utils {
    static _cslx(...inputs: ClassValue[]): string {
        return cslx(inputs)
    }

    static _signIn(service: string){
        return signIn(service, {callbackUrl: '/(dashboard)'})
    }

    static _twMerge(cslx: string): string {
        return twMerge(cslx)
    }

    static _buttonVariants(props: never): string{
        return buttonVariants(props)
    }

    static classNames(...inputs: ClassValue[]):string {
        return this._twMerge(this._cslx(inputs))
    }

    static buttonClassNames(props: {
        size: "default" | "sm" | "lg" | null | undefined;
        variant: "default" | "ghost" | null | undefined;
        className: string | undefined
    }):string{
        return this.classNames(this._buttonVariants(props as never))
    }

    static loginWithGoogle(setIsLoading:(isLoading: boolean)=>void){
        return (async ()=>{
            setIsLoading(true)
            try{
                await this._signIn('google')
            }catch(error){
                console.error({error})
                this.toastError('something went wrong with the login')
            }finally{
                setIsLoading(false)
            }
        })
    }

    static toastError(msg:string){
        toast.error(msg)
    }

    static async addFriend(props: addFriendInterface){
        try{
            const validEmail = addFriendValidator.parse({email: props.email})
            await axios.post('/api/friends/add', {email: validEmail})
            props.setShowSuccessState(true)
        }catch(e){
            let message = "Something went wrong, check logs"

            if (e instanceof ZodError){
                message = e.message
            }else if (e instanceof AxiosError){
                message = e.response?.data
            }

            props.setError("email",{message})
        }
    }

    static toPusherKey(s: string):string{
        return s.replace(/:/g, '__')
    }
}
