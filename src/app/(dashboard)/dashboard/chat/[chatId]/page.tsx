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
    const users = await handler.getUsers();
    let user: User;
    let partner: User;

    if (users[0].id === session.user.id) {
        user = users[0];
        partner = users[1];
    } else {
        user = users[1];
        partner = users[0];
    }


    return <Display chatInfo={chatProfile} participants={{ user, partner, sessionId: session?.user?.id }} />
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
            <title>{`Chat With ${partner.name}`}</title>
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
