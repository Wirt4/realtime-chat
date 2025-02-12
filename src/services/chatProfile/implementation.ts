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

    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.repo.createChatProfile(this.chatId, new Set());
    }

    async addUserToChat(userId: string): Promise<void> {
        if (this.chatId) {
            await this.repo.addChatMember(this.chatId, userId);
            return
        }
        throw this.err
    }

    getChatId(): string {
        if (this.chatId) {
            return this.chatId;
        }
        throw this.err;
    }
}
