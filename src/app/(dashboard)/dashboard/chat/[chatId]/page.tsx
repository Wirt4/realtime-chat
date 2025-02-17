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
        return
    }

    const session = await myGetServerSession();
    if (!session) {
        notFound();
        return
    }

    const { chatId } = params;
    const handler = new AxiosWrapper(chatId);
    const chatProfile = await handler.getChatProfile()
    if (!chatProfile || !chatProfile?.members.has(session?.user.id)) {
        notFound();
        return
    }
    await handler.getMessages();
    await handler.getUsers();
    return <div>Chat With Bob</div>

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

class AxiosWrapper {
    private chatId: string;

    constructor(chatId: string) {
        this.chatId = chatId;
    }

    async getChatProfile() {
        return this.get('api/chatprofile/getprofile');
    }

    async getUsers() {
        return this.get('api/chatprofile/getUsers');
    }

    async getMessages() {
        return this.get('api/messages/get');
    }

    private async get(endpoint: string) {
        const res = await axios.get(`${endpoint}?id=${this.chatId}`)
        return res?.data;
    }
}
