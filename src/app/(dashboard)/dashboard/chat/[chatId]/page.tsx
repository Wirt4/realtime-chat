import { FC } from "react";
import { notFound } from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import { db } from "@/lib/db";
import Messages from "@/components/Messages";
import { Helpers } from "@/app/(dashboard)/dashboard/chat/[chatId]/helpers";
import { Message } from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import Participants from "@/lib/chatParticipants";
import MessagesHeader from "@/components/MessagesHeader";

interface ChatProps {
    params: {
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({ params }) => {
    //pull chat id from params
    // if chat id is invalid, return not found
    // fetch the session
    // if the session is null, return not found
    // sessionID = sesson.user.id
    // fetch the chat profile from GET api/chatprofile/getprofile?id=chatId
    // if the chat profile is null, return not found
    // if the profile.members does not include sessionID, return not found
    // fetch the messages from Get api/messages/get?id=chatId
    // fetch the participants from api/chatprofile/getUsers?id=chatId
    // if participants[0] == sessionID, then user = participants[0], partner = participants[1], else user = participants[1], partner = participants[0]
    // return the page with the messages and the chat input
    const session = await myGetServerSession();
    const userId = session?.user?.id as string
    const { chatId } = params
    const participants = new Participants(chatId, userId as string) //this is the participants being computed by splitting the id, needs to be a lookup now
    const helpers = new Helpers()
    const initialMessages = await helpers.getChatMessages(chatId)

    if (!participants.includesSession()) {
        notFound();
    }
    const partner = (await db.get(participants.getPartnerQuery())) as User;
    const sessionUser = (await db.get(participants.getSessionUserQuery())) as User;

    const chatInfo = { chatId: chatId, messages: initialMessages }
    const chatters = { user: sessionUser, partner: partner, sessionId: userId }
    return <Display chatInfo={chatInfo} participants={chatters} />
}

interface DisplayProps {
    chatInfo: ChatInfo
    participants: ChatParticipants
}

interface ChatInfo {
    chatId: string
    messages: Message[]
}

interface ChatParticipants {
    user: User
    partner: User
    sessionId: string
}

const Display: FC<DisplayProps> = ({ chatInfo, participants }) => {
    const { partner } = participants
    const { chatId } = chatInfo

    return (
        <>
            <title>{`Chat with ${partner.name}`}</title>
            <div className='chat-a'>
                <MessagesHeader partner={partner} chatId={chatId} />
                <Messages initialMessages={chatInfo.messages} participants={participants} chatId={chatId} />
                <ChatInput chatPartner={partner} chatId={chatId} />
            </div>
        </>
    )
}


export default Page;
