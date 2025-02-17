import { FC } from "react";
import { notFound } from "next/navigation";
import Messages from "@/components/Messages";
import { Message } from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import MessagesHeader from "@/components/MessagesHeader";
import myGetServerSession from "@/lib/myGetServerSession";
import axios from "axios";

interface ChatProps {
    params: {
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({ params }) => {
    if (!isValidId(params.chatId)) {
        notFound();
    }
    const session = await myGetServerSession();
    if (!session) notFound();
    const chatProfile = await axios.get(`api/chatprofile/getprofile?id=${params.chatId}`)
    if (!chatProfile?.data) notFound();
    if (!chatProfile.data?.members.has(session?.user.id)) notFound();
    // fetch the chat profile from GET api/chatprofile/getprofile?id=chatId

    return <div />

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

function isValidId(id: string): boolean {
    const regex = /^[a-z0-9-]{36}--[a-z0-9-]{36}$/;
    return regex.test(id);
}
