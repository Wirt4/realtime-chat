'use client'

import {FC, useRef, useState} from "react";
import {Message} from "@/lib/validations/messages"
import {MessageTimeStamp} from "@/components/MessageTimeStamp";

interface MessagesProps {
    initialMessages: Message[],
    sessionId: string
}

const Messages: FC<MessagesProps> = ({initialMessages, sessionId}) => {
    const [messages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    return <div aria-label='messages' className='message-scroll'>
        <div ref={scrollDownRef}>
        {messages.map((message, index) => {
            const hasNextMessage = userHasNextMessage(messages, index)
            const classes = new ClassNames(sessionId === message.senderId, hasNextMessage)

            return (
               <div key={listKey(message)} className={classes.div1}>
                   <div className={classes.div2}>
                       <span className={classes.span}>
                           {message.text}{' '}
                          <MessageTimeStamp unixTimestamp={message.timestamp}/>
                       </span>
                   </div>
               </div>
           )
        })}
    </div>
    </div>
}

const listKey = (message: Message) =>{
    const {id, timestamp} = message
    return `${id}-${timestamp}`
}

const userHasNextMessage = (messages: Message[], ndx: number) =>{
    return messages[ndx +1]?.senderId === messages[ndx].senderId
}

class ClassNames {
    private readonly isCurrentUser: boolean
    private readonly hasNextMessage: boolean

    constructor(isCurrentUser: boolean, hasNextMessageFromSameUser: boolean) {
        this.isCurrentUser = isCurrentUser
        this.hasNextMessage = hasNextMessageFromSameUser
    }

    className(base: string, ifIsUserId: string, ifNotUserId: string | null = null){
        const suffix = this.isCurrentUser ? ifIsUserId : ifNotUserId
        if (!suffix){
            return base
        }
        return `${base} ${suffix}`
    }

    get div1(): string{
        return this.className('flex items-end', '', 'justify-end' )
    }

    get div2(): string{

        return this.className('message-div-2','order-1 items-start', 'order-1 items-end' )
    }

    bubble(isSpeechBalloon: boolean): string{
        let partnerStyling = 'bg-black text-white mt-1'
        let currentUserStyling = 'bg-white text-black outline mt-2'

        if (isSpeechBalloon){
            partnerStyling += ' rounded-br-none'
            currentUserStyling += ' rounded-bl-none'
        }

        return this.className('px-4 py-2 rounded-lg inline-block', currentUserStyling, partnerStyling )
    }

   get span(): string{
        return this.bubble(!this.hasNextMessage )
   }
}

export default Messages;
