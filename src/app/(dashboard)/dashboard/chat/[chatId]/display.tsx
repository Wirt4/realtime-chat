import ChatInput from "@/components/ChatInput/ChatInput"
import Messages from "@/components/Messages"
import MessagesHeader from "@/components/MessagesHeader"
import { FC } from "react"
import { DisplayProps } from "./interfaces"

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
export default Display
