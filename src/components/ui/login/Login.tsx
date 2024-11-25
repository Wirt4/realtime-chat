'use client'

import {FC, useState} from 'react'
import Button from "@/components/ui/button/Button";
import GoogleLogo from "@/assets/svgPaths/googleSVG";
import {Utils} from "@/lib/utils";
import {MessagesSquare} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Login:FC =()=>{
    const [isLoading, setIsLoading] = useState<boolean>(false)
    return <div className='p-5 justify-center'>
        <h1 className='flex'>Wirt's Realtime Chat<MessagesSquare/></h1>
        <div className='md:flex'>
            <Image alt="Wirt Salthouse" width={275} height={275} src="/wirt_salthouse.jpg" className='rounded-sm'/>
            <div className='flex items-end'>
            <div className='md:px-10'>
                <h2 className='text-2xl font-bold tracking-tight pt-10'>Sign in with Google</h2>
                <Button isLoading={isLoading} type='button' className='login-button' onClick={Utils.loginWithGoogle(setIsLoading)}>
                    {isLoading? null: <GoogleLogo/>} Google
                </Button>
                <ul className='pt-5'>
                    <li>Add friends and chat</li>
                    <li>Mobile-first design</li>
                    <li><Link href='/login'>View source code at <strong><u>Github</u></strong></Link></li>
                </ul>
                </div>
            </div>
        </div>
    </div>
}

export default Login
