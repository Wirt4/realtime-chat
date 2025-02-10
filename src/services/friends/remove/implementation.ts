import { idToRemoveSchema } from "@/schemas/idToRemoveSchema";
import { aRemoveFriendsService } from "./abstact";
import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aUserRepository } from "@/repositories/user/abstract";
import { aMessageRepository } from "@/repositories/message/removeAll/abstract";

export class RemoveFriendsService extends aRemoveFriendsService {
    private friendsRepository: aFriendsRepository;
    private userRepository: aUserRepository;
    private messageRepository: aMessageRepository;

    constructor(friendsRepository: aFriendsRepository, userRepository: aUserRepository, messageRepository: aMessageRepository) {
        super()
        this.friendsRepository = friendsRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    async removeFriends(ids: Ids): Promise<void> {
        if (!await this.friendsRepository.exists(ids.requestId, ids.sessionId)) return;
        await Promise.all([
            this.friendsRepository.remove(ids.requestId, ids.sessionId),
            this.friendsRepository.remove(ids.sessionId, ids.requestId)
        ]);
        const requestUsersChats: ChatProfile[] = await this.userRepository.getUserChats(ids.requestId);
        const sessionUserChats: ChatProfile[] = await this.userRepository.getUserChats(ids.sessionId);
        const rawChats = requestUsersChats.concat(sessionUserChats);
        const targetChats: string[] = [];

        rawChats.forEach(chat => {
            if (chat.participants.length === 2 && chat.participants.includes(ids.requestId) && chat.participants.includes(ids.sessionId)) {
            }
            targetChats.push(chat.id);
        });

        targetChats.forEach(async chatId => {
            await this.messageRepository.removeAllMessages(chatId);
        })
    }

    getIdToRemove(body: { idToRemove: string; }): string {
        return idToRemoveSchema.parse(body).idToRemove;
    }
}
