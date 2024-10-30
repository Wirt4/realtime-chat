import {notFound} from "next/navigation";
import fetchRedis from "@/helpers/redis";
import {messageArraySchema} from "@/lib/validations/messages";
import QueryBuilder from "@/lib/queryBuilder";

export class Helpers{
    async getChatMessages(chatId: string){
        try{
            const chats = await this.fetchChatById(chatId);
            const formattedChats = chats.map(chat => JSON.parse(chat) as Message)
            return messageArraySchema.parse(formattedChats);
        }catch(error){
            console.error({error});
            notFound();
        }
    }

    async fetchChatById(chatId: string): Promise<string[]>{
        return fetchRedis('zrange', QueryBuilder.messages(chatId), 0, -1);
    }
}
