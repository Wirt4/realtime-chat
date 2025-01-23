export interface ChatImageProps {
    participantInfo: {
        id: string, image:
        string
    }[],
    chatId: string,
    sessionId: string
    size: number
}
