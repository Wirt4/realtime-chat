import { Message } from "@/lib/validations/messages";

export interface DisplayProps {
    chatInfo: ChatInfo
    participants: ChatParticipants
}

interface ChatParticipants {
    user: User
    partner: User
    sessionId: string
}

interface ChatInfo {
    chatId: string
    messages: Message[]
}
