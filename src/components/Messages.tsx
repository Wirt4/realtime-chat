'use client'

import {FC, useState} from "react";
import {Message} from "@/lib/validations/messages"

interface MessagesProps {
    initialMessages: Message[],
    sessionId: string
}
const Messages: FC<MessagesProps> = ({initialMessages, sessionId}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    return <div aria-label='messages' className='message-scroll'>
        {messages.map((message, index) => {
            const foo = messages[index - 1]?.senderId === messages[index].senderId
            const classes = new ClassNames(sessionId === message.senderId, foo)
            return (
               <div key={listKey(message)} className={classes.div1}>
                   <div className={classes.div2}>
                       <span className={classes.span}>
                           {message.text}{' '}
                           <span className='message-date'>
                               {message.timestamp}
                           </span>
                       </span>
                   </div>
               </div>
           )
        })}
    </div>
}

const listKey = (message: Message) =>{
    const {id, timestamp} = message
    return `${id}-${timestamp}`
}


class ClassNames {
    private readonly isCurrentUser: boolean
    private readonly hasNextMessage: boolean

    constructor(isCurrentUser: boolean, hasNextMessageFromSameUser: boolean) {
        this.isCurrentUser = isCurrentUser
        this.hasNextMessage = hasNextMessageFromSameUser
    }

    class(base: string, ifIsUserId: string, ifNotUserId: string | null = null){
        const suffix = this.isCurrentUser ? ifIsUserId : ifNotUserId
        if (!suffix){
            return base
        }
        return `${base} ${suffix}`
    }

    get div1(): string{
        return this.class('flex items-end', 'justify-end')
    }

    get div2(): string{
        return this.class('message-div-2','order-1 items-end', 'order-2 items-start' )
    }

    bubble(isSpeechBalloon: boolean): string{
        let currentUserStyling = 'bg-blue-800 text-white'
        let partnerStyling = 'bg-gray-200 text-gray-900'

        if (isSpeechBalloon){
            currentUserStyling += ' rounded-bl-none'
            partnerStyling += ' rounded-br-none'
        }

        return this.class('px-4 py-2 rounded-lg inline-block', currentUserStyling, partnerStyling )
    }

   get span(): string{
        return this.bubble(!this.hasNextMessage )
   }
}

export default Messages;
