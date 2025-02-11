import { aIdGeneratorService } from "../../../__tests__/node/services/idGenerator/abstract";
import { aChatProfileService } from "./abstract";

export class ChatProfileService implements aChatProfileService {
    private idGenerator: aIdGeneratorService
    constructor(idGenerator: aIdGeneratorService) {
        this.idGenerator = idGenerator;
    }
    async createChat(): Promise<void> {
        this.idGenerator.newId();
    }

    async addUserToChat(chatId: string, userId: string): Promise<void> {

    }

    getChatId(): string {
        return this.createChatId();
    }


    private createChatId(): string {
        const array = new Uint8Array(74);
        crypto.getRandomValues(array);
        return this.arrToString(array);
    }

    private arrToString(arr: Uint8Array): string {
        const allowed = "-abcdefghijklmnopqrstuvwxyz0123456789";
        let s = ""
        for (let i = 0; i < arr.length; i++) {
            if (i === 36 || i === 37) {
                s += "-";
            } else {
                s += allowed[arr[i] % allowed.length];
            }
        }
        return s;
    }
}
