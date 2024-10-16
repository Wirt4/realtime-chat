'use client'

import {FC, useState} from "react";
import {Check, UserPlus, X} from 'lucide-react';
import axios from "axios";
import {useRouter} from "next/router";

interface FriendRequestsProps {
    incomingFriendRequests: {
        senderId:string,
        senderEmail:string
    }[]
}


const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    const [requests, setRequests] = useState<{
        senderId:string,
        senderEmail:string
    }[]>(incomingFriendRequests);

    const accept = async (senderId: string) =>{
        await axios.post('/api/friends/accept', {id: senderId})
        setRequests([]);
    }

    return <div aria-label='friend requests'>
        {incomingFriendRequests.length == 0 ?
        <p className='friend-requests-nothing'>Nothing to show here...</p>:
            requests.map((r)=>{
                return (<div className='friend-requests' key={r.senderId}>
                    <UserPlus  aria-label='add user'/>
                    <p className='friend-requests-email'>{r.senderEmail}</p>
                    <button aria-label={`accept friend: ${r.senderEmail}`} onClick={()=>accept(r.senderId)}
                            className='friend-requests-check'>
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
