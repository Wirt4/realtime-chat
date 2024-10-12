'use client'

import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/button/Button'
import { addFriendValidator, FormData } from '@/lib/validations/add-friend'
import {Utils} from "@/lib/utils"

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = () => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    });

    const onSubmit = (data: FormData) => {
        const {email} = data
        Utils.addFriend({email, setShowSuccessState, setError})
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='max-w-sm'>
            <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'>
                Add a Friend by Email:
            </label>

            <div className='mt-2 flex gap-4'>
                <input
                    {...register('email')}
                    type='text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='you@example.com'
                />
                <Button role='button'>Add</Button>
            </div>
            <p className='mt-1 text-sm text-red-600'>{errors.email?.message}</p>
            {showSuccessState ? (
                <p className='mt-1 text-sm text-green-600'>Friend request sent!</p>
            ) : null}
        </form>
    )
}

export default AddFriendButton;
