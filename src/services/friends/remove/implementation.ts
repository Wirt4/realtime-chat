import { idToRemoveSchema } from "@/schemas/idToRemoveSchema";
import { aRemoveFriendsService } from "./abstact";
import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aUserRepository } from "@/repositories/user/abstract";
import { aMessageRepository } from "@/repositories/message/removeAll/abstract";
import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";

export class RemoveFriendsService extends aRemoveFriendsService {
    private friendsRepository: aFriendsRepository;
    private userRepository: aUserRepository;
    private messageRepository: aMessageRepository;
    private chatProfileRepository: aChatProfileRepository;

    constructor(
        friendsRepository: aFriendsRepository,
        userRepository: aUserRepository,
        messageRepository: aMessageRepository,
        chatProfileRepository: aChatProfileRepository
    ) {
        super()
        this.friendsRepository = friendsRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.chatProfileRepository = chatProfileRepository;
    }

    async removeFriends(ids: Ids): Promise<void> {
        if (!await this.friendsRepository.exists(ids.requestId, ids.sessionId)) return;
        await Promise.all([
            this.friendsRepository.remove(ids.requestId, ids.sessionId),
            this.friendsRepository.remove(ids.sessionId, ids.requestId)
        ]);
        const requestUsersChats: Set<string> = await this.userRepository.getUserChats(ids.requestId);
        if (requestUsersChats.size === 0) return;
        const sessionUserChats: Set<string> = await this.userRepository.getUserChats(ids.sessionId);
        if (sessionUserChats.size === 0) return;
        const intersection = new Set([...requestUsersChats].filter(x => sessionUserChats.has(x)));
        if (intersection.size === 0) return;
        intersection.forEach(async chatId => {
            const profile = await this.chatProfileRepository.getChatProfile(chatId);
            if (profile.members.size === 2) {
                await Promise.all([
                    this.userRepository.removeUserChat(ids.requestId, chatId),
                    this.userRepository.removeUserChat(ids.sessionId, chatId),
                    this.messageRepository.removeAllMessages(chatId)
                ])
            }
        });
    }

    getIdToRemove(body: { idToRemove: string; }): string {
        return idToRemoveSchema.parse(body).idToRemove;
    }
}
