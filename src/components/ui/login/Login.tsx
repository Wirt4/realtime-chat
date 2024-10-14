'use client'

import {FC, useState} from 'react'
import Button from "@/components/ui/button/Button";
import GoogleLogo from "@/assets/svgPaths/googleSVG";
import {Utils} from "@/lib/utils";
import {Icons} from "@/components/Icons";

const Login:FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const Logo = Icons.Logo
    return <div className= 'login-page'>
            <div className='login-body'>
                <div>
                    <Logo className='login-logo'/>
                    <h2 className='login-h2'>
                        Sign in with Google
                    </h2>
                </div>
                    <Button isLoading={isLoading} type='button'
                        className='login-button'
                        onClick={Utils.loginWithGoogle(setIsLoading)}>
                            {isLoading? null: <GoogleLogo/>}
                            Google
                    </Button>
            </div>
        </div>
}

export default Login
