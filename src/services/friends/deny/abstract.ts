export abstract class aDenyFriendsService {
    abstract removeEntry(ids: Ids): Promise<void>
    abstract getIdToDeny(body: { id: string }): string
    abstract triggerEvent(ids: Ids): Promise<void>
}
