import {FC} from 'react'

interface loginProps{}
const Login:FC<loginProps> = (args: loginProps) => {
    return <>
        <div className= 'flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='w-full flex flex-col items-center max-w-md space-y-8'>
                <div className='flex flex-col items-center gap-8'>
                    logo
                    <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                        Sign in with Google
                    </h2>
                </div>
            </div>
        </div>
    </>
}

export default Login
