import QueryBuilder from "@/lib/queryBuilder";

export default class Participants {
    private readonly userA: string
    private readonly userB: string
    private readonly sessionId: string

    constructor(chatId: string, sessionId: string) {
        const participants = chatId.split('--') // This is now outdated
        this.userA = participants[0]
        this.userB = participants[1]
        this.sessionId = sessionId
    }

    includesSession(): boolean {
        return this.userA == this.sessionId || this.userB == this.sessionId
    }

    partnerId(): string {
        return this.userA == this.sessionId ? this.userB : this.userA;
    }

    getPartnerQuery(): string {
        return QueryBuilder.user(this.partnerId());
    }

    getSessionUserQuery(): string {
        return QueryBuilder.user(this.sessionId);
    }
}
