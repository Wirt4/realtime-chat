import { aDashboardFacade } from "./abstact";
import { Redis } from "@upstash/redis";
import { UserRepository } from "../user/implementation";
import { FriendRequestsRepository } from "../friends/requestsImplementation";
import { FriendsRepository } from "../friends/friendsImplementation";
import { ChatProfileRepository } from "../chatProfile/implementation";

export class DashboardFacade extends aDashboardFacade {
    private userRepository: UserRepository;
    private reqestRepository: FriendRequestsRepository;
    private friendsRepository: FriendsRepository;
    private chatProfileRepository: ChatProfileRepository;

    constructor(db: Redis) {
        super();
        this.userRepository = new UserRepository(db);
        this.reqestRepository = new FriendRequestsRepository(db);
        this.friendsRepository = new FriendsRepository(db);
        this.chatProfileRepository = new ChatProfileRepository(db);
    }

    async getFriendRequests(sessionId: string): Promise<string[]> {
        return this.reqestRepository.get(sessionId);
    }

    async getFriendIds(sessionId: string) {
        return this.friendsRepository.get(sessionId);
    }

    async getUser(userId: string) {
        return this.userRepository.getUser(userId);
    }

    async getUsersChats(userId: string): Promise<string[]> {
        const chats = await this.userRepository.getUserChats(userId);
        return Array.from(chats);
    }

    async getChatProfile(chatId: string): Promise<ChatProfile> {
        return this.chatProfileRepository.getChatProfile(chatId);
    }
}
