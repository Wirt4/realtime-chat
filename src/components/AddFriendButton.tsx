"use client"

import {FC} from "react";
import Button from "@/components/ui/button/Button";
import {Submissions} from "@/lib/submissions";

const AddFriendButton: FC = ()=>{
    const sub = new Submissions()

    return <form onSubmit={sub.handleSubmit} className= 'max-w-sum' role="form">
        <label htmlFor='email'
        className='block text-sm font-medium leading-6 text-gray-900'>Add a Friend by Email:</label>
        <div className='mt-2 flex gap-4'>
            <input
                type="text"
                placeholder="yourfriend@example.com"
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
            />
            <Button>Add</Button>
        </div>
    </form>
}
export default AddFriendButton
