import { aIdGeneratorService } from "../idGenerator/abstract";
import { aChatProfileService } from "./abstract";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    private chatId: string | null = null;

    constructor(idGenerator: aIdGeneratorService) {
        this.idGenerator = idGenerator;
    }
    async createChat(): Promise<void> {
        this.chatId = this.idGenerator.newId();
    }

    async addUserToChat(chatId: string, userId: string): Promise<void> {

    }

    getChatId(): string {
        if (this.chatId) {
            return this.chatId;
        }
        throw "Chat not yet created"
    }
}
