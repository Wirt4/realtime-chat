'use client'

import {FC, useEffect, useRef, useState} from "react";
import {Message} from "@/lib/validations/messages"
import {MessageTimestamp} from "@/components/MessageTimestamp";
import MessageThumbnail from "@/components/MessageThumbnail";
import {getPusherClient} from "@/lib/pusher";

interface MessagesProps {
    initialMessages: Message[],
    participants: ChatParticipants,
    chatId: string
}

interface ChatParticipants{
    user: User
    partner: User
    sessionId: string
}

const Messages: FC<MessagesProps> = ({initialMessages, participants, chatId}) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const scrollDownRef = useRef<HTMLDivElement | null>(null)


    useEffect(() => {
        const pusherClient = getPusherClient()
        const channelName = `chat__${chatId}`
        const channel = pusherClient.subscribe(channelName)

        const messageHandler = (message: Message) => {
            setMessages((prev) => [...prev, message])
        }

        const event = 'incoming_message'
        channel.bind(event, messageHandler)

        return () => {
            channel.bind(event, messageHandler)
            pusherClient.unsubscribe(channelName)
        }
    }, [chatId])

    return <div aria-label='messages' className='message-scroll'>
        <div ref={scrollDownRef}>
        {messages.map((message, index) => {
            const hasNextMessage = userHasNextMessage(messages, index)
            const isCurrentUser = participants.sessionId === message.senderId
            const classes = new ClassNames(isCurrentUser, hasNextMessage)
            const userInfo = new ContextualUserInfo(participants)

            return (
               <div key={listKey(message)} className={classes.div1}>
                   <div className={classes.div2}>
                       <span className={classes.span}>
                           {message.text}{' '}
                          <MessageTimestamp unixTimestamp={message.timestamp}/>
                       </span>
                       <MessageThumbnail userStatus={{hasNextMessage, currentUser: isCurrentUser}}
                                         userInfo={userInfo.userInfo(isCurrentUser)}/>
                   </div>
               </div>
           )
        })}
    </div>
    </div>
}

class ContextualUserInfo{
    participants: ChatParticipants

    constructor(participants: ChatParticipants) {
        this.participants = participants
    }

    userInfo(isCurrentUser: boolean): {userName:string, image:string}{
        const {name, image} = isCurrentUser ? this.participants.user : this.participants.partner
        return {userName: name, image}
    }
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
        let partnerStyling = 'bg-blue-500 text-white outline'
        let currentUserStyling = 'bg-orange-500 text-white outline'

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
