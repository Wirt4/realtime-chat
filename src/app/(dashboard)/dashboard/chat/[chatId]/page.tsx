import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import Image from "next/image";
import {db} from "@/lib/db";
import Messages from "@/components/Messages";
import {Helpers} from "@/app/(dashboard)/dashboard/chat/[chatId]/helpers";
import {Message} from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import Participants from "@/lib/chatParticipants.js";

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
    const sessionUser = (await db.get(participants.getSessionUserQuery())) as User;

    return<Display chatInfo={{chatId:chatId, messages: initialMessages}} participants={{user: sessionUser, partner: partner, sessionId: userId}}/>
}

interface DisplayProps {
    chatInfo : ChatInfo
    participants: ChatParticipants
}

interface ChatInfo{
    chatId: string
    messages: Message[]
}

interface ChatParticipants{
    user: User
    partner: User
    sessionId: string
}

const Display: FC<DisplayProps> = ({chatInfo, participants}) =>{
    return<div className='chat-a'>
        <Header partner = {participants.partner}/>
        <Messages initialMessages={chatInfo.messages}
                  sessionId={participants.sessionId} partner={participants.partner}
                  sessionImage={participants.user.image}
                  sessionName={participants.user.name}/>
        <ChatInput chatPartner={participants.partner} chatId={chatInfo.chatId}/>
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
