'use client'

import {FC} from "react";
import {Message} from "@/lib/validations/messages"

interface MessagesProps {
    initialMessages: Message[]
}
const Messages: FC<MessagesProps> = ({initialMessages}) => {
    return <div aria-label='messages' className='message-scroll'>
        <div>
           Hello World
        </div>
    </div>
}
export default Messages;
