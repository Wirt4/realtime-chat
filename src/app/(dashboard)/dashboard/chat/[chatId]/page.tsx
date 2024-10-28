import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import Image from "next/image";
import {db} from "@/lib/db";
import Messages from "@/components/Messages";
import {Helpers} from "@/app/(dashboard)/dashboard/chat/[chatId]/helpers";
import {Message} from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";

class Participants{
    private readonly userA: string
    private readonly userB: string
    private readonly sessionId: string

    constructor(chatId: string, sessionId: string){
        const participants = chatId.split('--')
        this.userA = participants[0]
        this.userB = participants[1]
        this.sessionId = sessionId
    }

    includesSession(): boolean{
        return this.userA == this.sessionId  ||  this.userB == this.sessionId
    }

    partnerId(): string{
        return this.userA == this.sessionId? this.userB : this.userA;
    }

    getPartnerQuery():string{
        /** note, this template string is EVERYWHERE, why not use some kind of utils function?**/
        return `user:${this.partnerId()}`
    }
}

interface ChatProps{
    params: {
        chatId:string;
    }
}

const Page: FC<ChatProps> = async ({params}) => {
    const session = await myGetServerSession();
    const userId = session?.user?.id as string
    const {chatId} = params
    const participants = new Participants(chatId, userId as string)
    const helpers = new Helpers()
    const initialMessages = await helpers.getChatMessages(chatId)

    if (!participants.includesSession()){
        notFound();
    }
    const partner = (await db.get(participants.getPartnerQuery())) as User;

    return<Display partner={partner} messages={initialMessages} userId={userId} chatId={chatId}/>
}

interface DisplayProps {
    partner: User
    messages: Message[]
    userId: string
    chatId: string
}

const Display: FC<DisplayProps> = ({partner, messages, userId, chatId}) =>{
    return<div className='chat-a'>
        <Header partner = {partner}/>
        <Messages initialMessages={messages} sessionId={userId}/>
        <ChatInput chatPartner={partner} chatId={chatId}/>
    </div>
}

interface HeaderProps {
    partner: User
}

const Header: FC<HeaderProps> = ({partner})=> {
    const {image, name, email} = partner
    return <div className='chat-b'>
        <div className='chat-c'>
            <div className='relative'>
                <div className='chat-d'>
                    <Image src={image}
                           fill
                           alt={name}
                           referrerPolicy='no-referrer'
                           className='chat-image'/>
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
        </div>
    </div>
}

export default Page;
