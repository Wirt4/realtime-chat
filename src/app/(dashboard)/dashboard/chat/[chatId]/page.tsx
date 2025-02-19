import { FC } from "react";
import { notFound } from "next/navigation";
import Messages from "@/components/Messages";
import { Message } from "@/lib/validations/messages";
import ChatInput from "@/components/ChatInput/ChatInput";
import MessagesHeader from "@/components/MessagesHeader";
import myGetServerSession from "@/lib/myGetServerSession";
import { Utils } from "@/lib/utils";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { UserRepository } from "@/repositories/user/implementation";
import { ChatProfileService } from "@/services/chatProfile/implementation";
import { db } from "@/lib/db";
import { MessageService } from "@/services/message/service";
import { GetMessagesRepository } from "@/repositories/message/get/implementation";

interface ChatProps {
    params: {
        chatId: string;
    }
}

const Page: FC<ChatProps> = async ({ params }) => {
    if (!Utils.isValidChatId(params.chatId)) {
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
    const messages = await handler.getMessages();
    const chatInfo = { chatId, messages }
    const users = await handler.getUsers();

    return <Display chatInfo={chatInfo} participants={deriveChatParticipants(session?.user?.id, users)} />
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

class AxiosWrapper {
    private chatId: string;

    constructor(chatId: string) {
        this.chatId = chatId;
    }

    async getChatProfile() {
        const chatRepo = new ChatProfileRepository(db);
        const userRepo = new UserRepository(db);
        const service = new ChatProfileService(chatRepo, userRepo);
        return service.getProfile(this.chatId);
    }

    async getUsers(): Promise<User[]> {
        const chatRepo = new ChatProfileRepository(db);
        const userRepo = new UserRepository(db);
        const service = new ChatProfileService(chatRepo, userRepo);
        const userSet = await service.getUsers(this.chatId);
        return Array.from(userSet);
    }

    async getMessages() {
        const messageService = new MessageService();
        return messageService.getMessages(this.chatId, new GetMessagesRepository());
    }

    /* private async get(endpoint: string) {
         const messageService = new MessageService();
         return messageService.getMessages(endpoint);
         const res = await axios.get(`${endpoint}?id=${this.chatId}`)
         return res?.data;
     }*/
}

function deriveChatParticipants(sessionId: string, participants: User[]): ChatParticipants {
    console.log('sessionId', sessionId);
    console.log('participants', participants);
    let user: User;
    let partner: User;
    if (participants[0].id === sessionId) {
        user = participants[0];
        partner = participants[1];
    } else {
        user = participants[1];
        partner = participants[0];
    }
    return { user, partner, sessionId: sessionId }
}
