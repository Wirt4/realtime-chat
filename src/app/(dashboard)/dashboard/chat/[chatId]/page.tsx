import { FC } from "react";
import { notFound } from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import Messages from "@/components/Messages";
import { Message } from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import MessagesHeader from "@/components/MessagesHeader";
import axios from "axios";

interface ChatProps {
    params: {
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({ params }) => {
    // if chat id is invalid, return not found
    if (!params.chatId) {
        notFound();
    }
    const regex = /^[a-z0-9-]{36}--[a-z0-9-]{36}$/;
    if (!regex.test(params.chatId)) {
        notFound();
    }
    return <div />

    // if chat id is invalid, return not found
    //const regex = /^[a-z0-9-]{36}--[a-z0-9-]{36}$/;
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
