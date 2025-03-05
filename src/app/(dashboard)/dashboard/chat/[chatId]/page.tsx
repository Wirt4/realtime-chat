import { FC } from "react";
import { notFound } from "next/navigation";
import myGetServerSession from "@/lib/myGetServerSession";
import { Utils } from "@/lib/utils";
import { Handler } from "./handler"
import Display from "./display";

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
    const handler = new Handler(chatId);
    const chatProfile = await handler.getChatProfile()
    if (!(chatProfile && chatProfile?.members.has(session?.user.id))) {
        notFound();
        return
    }
    const messages = await handler.getMessages();
    const chatInfo = { chatId, messages }
    const users = await handler.getUsers();

    return <Display chatInfo={chatInfo} participants={handler.deriveChatParticipants(session?.user?.id, users)} />
}


export default Page;
