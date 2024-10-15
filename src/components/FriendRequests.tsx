'use client'

import {FC} from "react";
import {Check, UserPlus, X} from 'lucide-react';

interface FriendRequestsProps {
    incomingFriendRequests: {
        senderId:string,
        senderEmail:string
    }[]
}
const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    return <div aria-label='friend requests'>
        {incomingFriendRequests.length == 0 ?
        <p className='friend-requests-nothing'>Nothing to show here...</p>:
            incomingFriendRequests.map((request)=>{
                return (<div className='friend-requests' key={request.senderId}>
                    <UserPlus  aria-label='add user'/>
                    <p className='friend-requests-email'>{request.senderEmail}</p>
                    <button aria-label='accept friend' className='friend-requests-check'>
                        <Check aria-label='checkmark' className='friend-requests-button'/>
                    </button>
                    <button aria-label='deny friend' className='friend-requests-x'>
                        <X aria-label='x' className='friend-requests-button'/>
                    </button>
                </div>)
            })
        }</div>
}

export default FriendRequests;
