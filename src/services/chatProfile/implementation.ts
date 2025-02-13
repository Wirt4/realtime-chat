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
        console.log("creating chat");
        this.chatId = this.idGenerator.newId();
        await this.repo.createChatProfile(this.chatId);
    }

    async addUserToChat(userId: string): Promise<void> {
        console.log("addUserToChat called");
        if (this.chatId !== null) {
            await this.repo.addChatMember(this.chatId, userId);
            return
        }
        throw this.err
    }

    getChatId(): string {
        console.log("getChatId called");
        if (this.chatId) {
            return this.chatId;
        }
        throw this.err;
    }
}
