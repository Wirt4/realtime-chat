'use client'

import {FC} from "react";
import {Message} from "@/lib/validations/messages"

interface MessagesProps {
    initialMessages: Message[]
}
const Messages: FC<MessagesProps> = (props: MessagesProps) => {
    const p = props
    return <div aria-label='messages' className='message-scroll'>
        {p.initialMessages.length > 0 ? p.initialMessages[0].text: null}
    </div>
}
export default Messages;
