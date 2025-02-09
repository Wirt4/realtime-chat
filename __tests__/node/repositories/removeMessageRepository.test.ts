import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { Redis } from "@upstash/redis";

describe('repository.removeAllMessages tests', () => {
    it('check arguments passed to database.del', () => {
        const mockDb: Redis = {
            del: jest.fn()
        } as unknown as Redis
        const repository = new MessageRepository(mockDb)
        repository.removeAllMessages('foo--bar')
        expect(mockDb.del).toHaveBeenCalledWith('chat:foo--bar:messages')
    })
})
