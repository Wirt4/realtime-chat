import {SendMessageRepositoryInterface} from "@/repositories/message/interface";

export class MessageRepository implements SendMessageRepositoryInterface{
    sendMessage(chatId: string, message: Message): Promise<void>{
        console.log(chatId)
        console.log(message)
    }
}
