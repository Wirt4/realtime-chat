import { aChatName } from './abstract';

export class ChatName extends aChatName {
    private participants: User[];
    private sessionId: string;
    constructor(partcipants: User[], sessionId: string) {
        super();
        this.participants = partcipants;
        this.sessionId = sessionId;
    }

    getChatName(): string {
        let names: string[] = [];

        for (let i = 0; i < this.participants.length; i++) {
            if (this.participants[i].id !== this.sessionId) {
                names.push(this.participants[i].name);
            }
        }
        names.sort();

        if (names.length === 1) {
            return "Chat with" + names[0];
        }

        if (names.length === 2) {
            return "Chat with" + names.join(' and ');
        }

        const lastIndex = names.length - 1;
        names[lastIndex] = `and ${names[lastIndex]}`;
        return "Chat with " + names.join(', ');
    }
}
