'use client'
import {ButtonHTMLAttributes, FC, useState} from "react";
import Button from "@/components/ui/button/Button";
import {signOut} from "next-auth/react";
import {LogOut, Loader2} from 'lucide-react'
import {toast} from "react-hot-toast";

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutProps> = ({...props}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    return <Button {...props} onClick={async () => {
        try{
            setIsLoading(true);
            await signOut();
        }catch(error){
            console.error({error})
            toast.error("There was a problem logging out")
        }finally{
            setIsLoading(false)
        }
    }} aria-label= 'sign out button'>
            {isLoading? (<Loader2 aria-label="loading"/>):(<LogOut aria-label="log out"/>)}
    </Button>
}

export default SignOutButton;
