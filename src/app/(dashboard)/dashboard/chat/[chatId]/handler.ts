import { ChatProfileService } from "@/services/chatProfile/implementation";
import { MessageService } from "@/services/message/service";
import { MessageValidator } from "@/services/message/validator/implementation";
import { ChatParticipants } from "./interfaces";

export class Handler {
    private chatId: string;

    constructor(chatId: string) {
        this.chatId = chatId;
    }

    async getChatProfile() {
        const service = new ChatProfileService();
        return service.getProfile(this.chatId);
    }

    async getUsers(): Promise<User[]> {
        const service = new ChatProfileService();
        const userSet = await service.getUsers(this.chatId);
        return Array.from(userSet);
    }

    async getMessages() {
        const validator = new MessageValidator();
        const messageService = new MessageService(validator);
        return messageService.getMessages(this.chatId);
    }

    deriveChatParticipants(sessionId: string, participants: User[]): ChatParticipants {
        let user: User;
        let partner: User;
        if (participants[0].id === sessionId) {
            user = participants[0];
            partner = participants[1];
        } else {
            user = participants[1];
            partner = participants[0];
        }
        return { user, partner, sessionId: sessionId }
    }
}
