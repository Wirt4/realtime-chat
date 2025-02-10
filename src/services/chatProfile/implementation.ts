import { aChatProfileService } from "./abstract";

export class ChatProfileServce implements aChatProfileService {
    createChatId(): string {
        return "123456781234567812345678123456712341230045678123456781234567812345671234--";
    }
}
