'use client'

import {FC, useState} from 'react'
import Button from "@/components/ui/button/Button";
import GoogleLogo from "@/assets/svgPaths/googleSVG";
import {Utils} from "@/lib/utils";
import {MessagesSquare} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Login:FC =()=>{
    return <div className='login-page'>
        <h1 className='flex'>Wirt&apos;s Realtime Chat<MessagesSquare/></h1>
        <div className='md:flex'>
            <Pic/>
            <div className='my-justify-end'>
            <div className='md:px-10'>
                <h2>Sign in with Google</h2>
                <GoogleButton/>
                <Description/>
                </div>
            </div>
        </div>
    </div>
}

const Pic: FC=()=>{
    const width = 275
    const height = 275
    return <Image alt="Wirt Salthouse"
                  width={width}
                  height={height}
                  src="/wirt_salthouse.jpg"
                  className='rounded'/>
}

const GoogleButton: FC = ()=>{
    const [isLoading, setIsLoading] = useState<boolean>(false)

    return <Button isLoading={isLoading} type='button'
                   className='login-button'
                   onClick={Utils.loginWithGoogle(setIsLoading)}>
        {isLoading? null: <GoogleLogo/>} Google
    </Button>
}

const Description: FC = ()=> {
    return <ul className='pt-5'>
        <li>Add friends and chat</li>
        <li>Mobile-first design</li>
        <li><Link href='https://github.com/Wirt4/realtime-chat'>
            View source code at <strong><u>Github</u></strong></Link>
        </li>
    </ul>
}

export default Login
