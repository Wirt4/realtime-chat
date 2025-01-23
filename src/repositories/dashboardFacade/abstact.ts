export abstract class aDashboardFacade {
    abstract getFriendRequests(sessionId: string): Promise<string[]>;
    abstract getFriendIds(sessionId: string): Promise<string[]>;
    abstract getUser(userId: string): Promise<User>;
}
