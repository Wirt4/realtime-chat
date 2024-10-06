'use client'

import {FC, useState} from 'react'
import Button from "@/components/ui/button/Button";
import GoogleLogo from "@/components/ui/login/googleSVG";

interface loginProps{}

const Login:FC = () => {
    async  function logInWithGoogle(){} //can this be extracted to utils?
    const [isLoading, setIsLoading] = useState<boolean>(false)
    return <>
        <div className= 'flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full flex flex-col items-center max-w-md space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    logo
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Sign in with Google
                    </h2>
                </div>
                <Button isLoading={isLoading} type='button'
                        className='max-w-sm mx-auto w-full'
                        onClick={logInWithGoogle}
                >
                    <GoogleLogo/>
                    Google
                </Button>
            </div>
        </div>
    </>
}

export default Login
