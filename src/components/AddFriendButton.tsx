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
        <form onSubmit={handleSubmit(onSubmit)} className='addfriend-form'>
            <label
                htmlFor='email'
                className='addfriend-label'>
                Add a Friend by Email:
            </label>

            <div className='addfriend-input'>
                <input
                    {...register('email')}
                    type='text'
                    className='addfriend-field'
                    placeholder='you@example.com'
                />
                <Button role='button'>Add</Button>
            </div>
            <p className='addfriend-error'>{errors.email?.message}</p>
            {showSuccessState ? (
                <p className='addfriend-success'>Friend request sent!</p>
            ) : null}
        </form>
    )
}

export default AddFriendButton;
