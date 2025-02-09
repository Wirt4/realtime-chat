'use client'

import { FC, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface MessagesHeaderProps {
    partner: User
    chatId: string
}

const MessagesHeader: FC<MessagesHeaderProps> = ({ partner, chatId }) => {
    const { image, name, email, id } = partner
    const [hidden, setHidden] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const toggle = () => {
        setHidden(prev => !prev)
    }

    if (loading) {
        return <Loader2 className='loading' aria-label="loading" />
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
        </div>
    </div>
}

export default MessagesHeader
