'use client'

import {FC, useState} from "react";
import Image from "next/image";
import {X} from "lucide-react";

interface MessagesHeaderProps {
    partner: User
}

const MessagesHeader: FC<MessagesHeaderProps> = ({partner})=> {
    const {image, name, email} = partner
    const [hidden, setHidden]=  useState<boolean>(true)
    return <div className='chat-b'>
        <div className='chat-c'>
            <div className='relative'>
                <div className='chat-d'>
                    <Image src={image}
                           fill
                           alt={name}
                           referrerPolicy='no-referrer'
                           className='chat-image'
                           onClick={()=>{setHidden(false)}}
                    />
                </div>
            </div>
            <div className='chat-e'>
                <div className='chat-f'>
                        <span className='chat-g'>
                            {name}
                        </span>
                </div>
                <span className='chat-h'>
                        {email}
                    </span>
            </div>
            {hidden? null: (<div className='friend-requests'>

                <button>
                    <p className='friend-requests-email'>
                        Remove Friend
                    </p>
                </button>
                <button
                    className='friend-requests-x h-96'
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
