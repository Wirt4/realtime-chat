import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";
import { IdGeneratorService } from "../idGenerator/implementation";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    private chatId: string | null;
    private repo: aChatProfileRepository;
    private err = "Chat not yet created";

    constructor(repo: aChatProfileRepository, idGenerator: aIdGeneratorService = new IdGeneratorService()) {
        this.idGenerator = idGenerator;
        this.repo = repo;
        this.chatId = null;
    }

    async loadProfileFromUsers(users: Set<string>): Promise<void> {
        if (users.size == 0) {
            throw new Error('parameter "users" may not be an empty set');
        }

        try {
            console.log('calling profile');
            const profile = await this.repo.getChatProfileFromUsers(users);
            console.log('profile', profile);
            if (profile) {
                console.log('setting chatId to', profile.id);
                this.chatId = profile.id;
            } else {
                console.log('setting chatId to empty string');
                this.chatId = "";
            }
        } catch {
            throw new Error("can't retrive chat Id from repository");
        }
    }

    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.repo.createChatProfile(this.chatId);
    }

    async addUserToChat(userId: string): Promise<void> {
        if (this.chatId !== null) {
            await this.repo.addChatMember(this.chatId, userId);
            return
        }
        throw this.err
    }

    getChatId(): string {
        if (this.chatId !== null) {
            return this.chatId;
        }
        throw this.err;
    }
}
