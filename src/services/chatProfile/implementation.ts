import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";
import { IdGeneratorService } from "../idGenerator/implementation";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    private chatId: string | null = null;
    private repo: aChatProfileRepository;

    constructor(repo: aChatProfileRepository, idGenerator: aIdGeneratorService = new IdGeneratorService()) {
        this.idGenerator = idGenerator;
        this.repo = repo;
    }

    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
        await this.repo.createChatProfile(this.chatId, new Set());
    }

    async addUserToChat(chatId: string, userId: string): Promise<void> {
        await this.repo.addChatMember(chatId, userId);
    }

    getChatId(): string {
        if (this.chatId) {
            return this.chatId;
        }
        throw "Chat not yet created"
    }
}
