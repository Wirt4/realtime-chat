'use client'

import { FC, useState } from "react";
import Image from "next/image";

interface MessagesHeaderProps {
    partner: User
    chatId: string
}

const MessagesHeader: FC<MessagesHeaderProps> = ({ partner }) => {
    const { image, name, email } = partner
    const [hidden, setHidden] = useState<boolean>(true)

    const toggle = () => {
        setHidden(!hidden)
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
