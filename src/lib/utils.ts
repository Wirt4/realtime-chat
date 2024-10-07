import cslx, {ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import buttonVariants from "@/components/ui/button/buttonVariants"
import {signIn} from "next-auth/react"

export class Utils {
    static _cslx(...inputs: ClassValue[]): string {
        return cslx(inputs)
    }

    static _signIn(service: string){
        return signIn(service)
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
            }catch(e){}finally{
                setIsLoading(false)
            }
        })
    }
}
