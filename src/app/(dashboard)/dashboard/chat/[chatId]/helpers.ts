import { notFound } from "next/navigation";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";

export class Helpers {
    async getChatMessages(chatId: string) {
        try {
            console.log('chatId', chatId);
            //const chats = []//await this.fetchChatById(chatId);
            //const formattedChats = chats.map(chat => JSON.parse(chat) as Message)
            //return messageArraySchema.parse(formattedChats);
            return [];
        } catch (error) {
            console.error({ error });
            notFound();
        }
    }

    async fetchChatById(chatId: string): Promise<string[]> {
        console.log('fetchChatById called', chatId);
        // Fetch the chat messages from Redis, but it was not initially set
        return fetchRedis('zrange', QueryBuilder.messages(chatId), 0, -1);
    }
}
