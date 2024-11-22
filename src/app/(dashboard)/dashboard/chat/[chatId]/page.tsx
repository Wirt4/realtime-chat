import {FC} from "react";
import {notFound} from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import {db} from "@/lib/db";
import Messages from "@/components/Messages";
import {Helpers} from "@/app/(dashboard)/dashboard/chat/[chatId]/helpers";
import {Message} from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import Participants from "@/lib/chatParticipants";
import MessagesHeader from "@/components/MessagesHeader";

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

    const chatInfo = {chatId:chatId, messages: initialMessages}
    const chatters = {user: sessionUser, partner: partner, sessionId: userId}
    return<Display chatInfo={chatInfo} participants={chatters}/>
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
    const {partner} = participants
    const {chatId} = chatInfo

    return<>
        <title>Chat with Bob</title>
        <div className='chat-a'>
        <MessagesHeader partner = {partner} chatId={chatId}/>
        <Messages initialMessages={chatInfo.messages}
                  participants={participants}
                  chatId={chatId}
        />
        <ChatInput chatPartner={partner} chatId={chatId}/>
    </div></>
}


export default Page;
