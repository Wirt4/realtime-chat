'use client'

import {ButtonHTMLAttributes, FC, useState} from "react";
import Button from "@/components/ui/button/Button";
import {signOut} from "next-auth/react";
import {LogOut, Loader2} from 'lucide-react'
import {toast} from "react-hot-toast";

interface SignOutProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutProps> = ({...props}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return<li>
        <Button {...props} variant="ghost"
                onClick={clickHandler(setIsLoading)}
                className='link group'
                aria-label="sign out button">
            <span className='link-icon group-hover:border-black group-hover:black'>
                {logOutIcon(isLoading)}
            </span>
            <span className='truncate' >
                Sign Out
            </span>
        </Button>
    </li>
}

const clickHandler = (setIsLoading: (arg: boolean)=> void) =>{
    return async()=>{
        try{
            setIsLoading(true);
            await signOut();
        }catch(error){
            console.error({error})
            toast.error("There was a problem logging out")
        }finally{
            setIsLoading(false)
        }
    }
}

const logOutIcon = (isLoading:boolean)=>{
    if (isLoading){
        return <Loader2 className='loading' aria-label="loading"/>;
    }
    return <LogOut className = 'icon' aria-label="log out"/>;
}

export default SignOutButton;
