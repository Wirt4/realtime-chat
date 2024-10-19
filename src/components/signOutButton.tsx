'use client'

import {ButtonHTMLAttributes, FC, useState} from "react";
import Button from "@/components/ui/button/Button";
import {signOut} from "next-auth/react";
import {LogOut, Loader2} from 'lucide-react'
import {toast} from "react-hot-toast";

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutProps> = ({...props}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return <Button {...props} variant='ghost' onClick={async () => {
        try{
            setIsLoading(true);
            await signOut();
        }catch(error){
            console.error({error})
            toast.error("There was a problem logging out")
        }finally{
            setIsLoading(false)
        }
    }} aria-label= 'sign out button' className='dashboard-icon'>
        <div className='dashboard-div'>
            {isLoading? (<Loader2 className='loading' aria-label="loading"/>):(<LogOut className='icon' aria-label="log out"/>)}
        </div>
        <p>Sign Out</p>
    </Button>
}

export default SignOutButton;
