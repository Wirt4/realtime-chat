import {notFound} from "next/navigation";
import fetchRedis from "@/helpers/redis";
import {messageArraySchema} from "@/lib/validations/messages";

export class Helpers{
    async getChatMessages(chatId: string){
        try{
            const chats = await this.fetchChatById(chatId);
            console.log(chats)
            const formattedChats = chats.map(chat => JSON.parse(chat) as Message)
            return messageArraySchema.parse(formattedChats).reverse();
        }catch(error){
            console.error({error});
            notFound();
        }
    }

    async fetchChatById(chatId: string): Promise<string[]>{
        return fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1);
    }
}
