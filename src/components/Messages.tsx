'use client'

import {FC} from "react";
import {Message} from "@/lib/validations/messages"

interface MessagesProps {
    initialMessages: Message[]
}
const Messages: FC<MessagesProps> = () => {
    return <div aria-label='messages' className='message-scroll'>
           Hello World
    </div>
}
export default Messages;
