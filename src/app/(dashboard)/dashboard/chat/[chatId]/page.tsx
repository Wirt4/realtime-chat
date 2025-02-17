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
import { isMapIterator } from "util/types";
import axios from "axios";

interface ChatProps {
    params: {
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({ params }) => {
    // if chat id is invalid, return not found
    const { chatId } = params
    const regex = /^[a-z0-9-]{36}--[a-z0-9-]{36}$/;
    if (chatId == "" || !regex.test(params.chatId)) {
        notFound();
    }
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

    const session = await myGetServerSession()
    const chatInfo = { chatId: 'stub', messages: [] }
    let user: User = {
        name: 'stub',
        email: 'stub',
        image: 'http://stub',
        id: 'stub'
    }
    let partner: User = {
        name: 'Bob',
        email: 'stub',
        image: 'http://stub',
        id: 'stub'
    };
    const rawParticipants = await axios.get('/api/chatprofile/getUsers', { params: { id: chatId } })
    console.log("axios result", rawParticipants)
    for (let u in rawParticipants?.data) {
        if (rawParticipants.data[u].id == session?.user.id) {
            user = rawParticipants.data[u]
        } else {
            partner = rawParticipants.data[u]
        }
    }

    const chatters = { user, partner, sessionId: 'stub' }
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
