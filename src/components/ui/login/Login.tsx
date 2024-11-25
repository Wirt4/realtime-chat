'use client'

import {FC, useState} from 'react'
import Button from "@/components/ui/button/Button";
import GoogleLogo from "@/assets/svgPaths/googleSVG";
import {Utils} from "@/lib/utils";
import {Icons} from "@/components/Icons";
import Image from "next/image";

const Login:FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const Logo = Icons.Logo
    return <div className= 'login-page'>
        <h1>Wirt's Realtime Chat</h1>
        <div className='login-body'><Image alt="Wirt Salthouse" width={275} height={275} src="/wirt_salthouse.jpg"/></div>
            <div className='login-body'>
                <div>
                    <Logo className='login-logo'/>
                    <h2 className='login-h2'>
                        Sign in with Google
                    </h2>
                    <Button isLoading={isLoading} type='button'
                        className='login-button'
                        onClick={Utils.loginWithGoogle(setIsLoading)}>
                            {isLoading? null: <GoogleLogo/>}
                            Google
                    </Button>
                </div>
            </div>
        </div>
}

export default Login
