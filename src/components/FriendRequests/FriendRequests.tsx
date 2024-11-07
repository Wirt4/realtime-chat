'use client'

import {FC, useEffect, useState} from "react";
import {Check, UserPlus, X} from 'lucide-react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import subscribeToPusherClient from "@/components/FriendRequests/helpers"

interface FriendRequestsProps {
    incomingFriendRequests: FriendRequest[]
}

type command = 'accept' | 'deny'

const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    const router = useRouter()
    const [requests, setRequests] = useState<{
        senderId:string,
        senderEmail:string
    }[]>(incomingFriendRequests);

    const apiPost = async (senderId: string, cmd: command) =>{
        await axios.post(`/api/friends/${cmd}`, {id: senderId});
        setRequests(previousOptions => previousOptions.filter(item=> item.senderId != senderId));
        router.refresh();
    }

    const accept = async (senderId: string)=>{
        await apiPost(senderId, 'accept')
    }

    const deny = async (senderId: string)=>{
        await apiPost(senderId, 'deny')
    }

    useEffect(subscribeToPusherClient, []);

    return <div aria-label='friend requests'>
        {incomingFriendRequests.length == 0 ?
        <p className='friend-requests-nothing'>
            Nothing to show here...
        </p>:
            requests.map((request)=>{
                return (<div className='friend-requests' key={request.senderId}>
                    <UserPlus  aria-label='add user'/>
                    <p className='friend-requests-email'>
                        {request.senderEmail}
                    </p>
                    <button aria-label={`accept friend: ${request.senderEmail}`}
                            onClick={()=>accept(request.senderId)}
                            className='friend-requests-check'
                    >
                        <Check aria-label='checkmark'
                               className='friend-requests-button'
                        />
                    </button>
                    <button aria-label={`deny friend: ${request.senderEmail}`}
                            onClick={()=>deny(request.senderId)}
                            className='friend-requests-x'
                    >
                        <X aria-label='x'
                           className='friend-requests-button'
                        />
                    </button>
                </div>)
            })
        }</div>
}

export default FriendRequests;
