'use client'

import {FC, useState} from "react";
import Image from "next/image";
import {Loader2, X} from "lucide-react";
import axios from "axios";

interface MessagesHeaderProps {
    partner: User
    chatId: string
}

const MessagesHeader: FC<MessagesHeaderProps> = ({partner, chatId})=> {
    const {image, name, email, id} = partner
    const [hidden, setHidden] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const toggle= ()=>{
        setHidden(prev=> !prev)
    }

    const handler = async ()=>{
        if (!loading){
            try{
                setLoading(true)
                await axios.post('/api/message/remove/all',{chatId})
                await axios.post('/api/friends/remove', {idToRemove: id})
            }catch(error){
                console.error({error})
            }finally {
                setLoading(false)
            }
        }
    }

    if (loading){
        return <Loader2 className='loading' aria-label="loading"/>
    }

    return <div className='chat-b'>
        <div className='chat-c'>
            <div className='relative'>
                <div className='chat-d'>
                    <Image src={image}
                           fill
                           alt={name}
                           referrerPolicy='no-referrer'
                           className='chat-image'
                           onClick={toggle}
                    />
                </div>
            </div>
            <div className='chat-e'>
                <div className='chat-f'>
                        <span className='chat-g'
                              onClick={toggle}>
                            {name}
                        </span>
                </div>
                <span className='chat-h'>
                        {email}
                    </span>
            </div>
            {hidden? null: (<div className='friend-requests'>

                <button onClick={handler}>
                    <p className='friend-requests-email'>
                        Remove Friend
                    </p>
                </button>
                <button
                    className='friend-requests-x h-96'
                    onClick={handler}
                >
                    <X aria-label='x'
                       className='friend-requests-button'
                    />
                </button>
            </div>)}
        </div>
    </div>
}

export default MessagesHeader
