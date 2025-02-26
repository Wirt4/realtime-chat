import { db } from "@/lib/db";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { UserRepository } from "@/repositories/user/implementation";
import chatProfileRepositoryFacade from "./repositoryFacade";
import { Redis } from "@upstash/redis";

export default function repositoryFacadeFactory(): chatProfileRepositoryFacade {
    return new Facade(db);
}

class Facade implements chatProfileRepositoryFacade {
    private profileRepo: ChatProfileRepository;
    private userRepo: UserRepository;
    constructor(database: Redis) {
        this.profileRepo = new ChatProfileRepository(database);
        this.userRepo = new UserRepository(database);
    }

    getChatProfile(chatId: string): Promise<ChatProfile> {
        return this.profileRepo.getChatProfile(chatId);
    }

    getUser(userId: string): Promise<User> {
        return this.userRepo.getUser(userId);
    }

    async createChatProfile(chatId: string, members: Set<string>): Promise<void> {
        console.log('facade callind profile repository with', chatId, members);
        await this.profileRepo.createChatProfile(chatId, members);
    }

    async addChatMember(chatId: string, userId: string): Promise<void> {
        await this.profileRepo.addChatMember(chatId, userId);
    };

    async overwriteProfile(profile: ChatProfile): Promise<void> {
        await this.profileRepo.overWriteChatProfile(profile);
    };

    getUserChats(userId: string): Promise<Set<string>> {
        return this.userRepo.getUserChats(userId);
    }

}
