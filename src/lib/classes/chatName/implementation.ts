import { aChatName } from './abstract';

export class ChatName extends aChatName {
    private names: string[];

    constructor(partcipants: User[], sessionId: string) {
        super();
        this.names = [];
        for (let i = 0; i < partcipants.length; i++) {
            if (partcipants[i].id !== sessionId) {
                this.names.push(partcipants[i].name);
            }
        }
        this.names.sort();
    }

    getChatName(): string {
        return "Chat with " + this.suffix();
    }

    private suffix(): string {
        if (this.names.length === 1) {
            return this.names[0];
        }

        if (this.names.length === 2) {
            return this.names.join(' and ');
        }

        const lastIndex = this.names.length - 1;
        this.names[lastIndex] = `and ${this.names[lastIndex]}`;
        return this.names.join(', ')
    }
}
