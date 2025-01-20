import { SendMessageRepository } from "@/repositories/message/send/implementation";
import { aSendMessageRepository } from "@/repositories/message/send/abstract";
import { Redis } from "@upstash/redis";

describe('repository.sendMessage tests', () => {
    let mockDb: Redis
    let repository: aSendMessageRepository
    beforeEach(() => {
        mockDb = {
            zadd: jest.fn()
        } as unknown as Redis
        repository = new SendMessageRepository(mockDb)
    })
    it('zadd should be called on database', async () => {
        await repository.sendMessage('chatId', { id: 'id', senderId: 'senderId', text: 'text', timestamp: 123 })
        expect(mockDb.zadd).toHaveBeenCalled()
    })
    it('check arguments passed to zadd', async () => {
        await repository.sendMessage('chatId', { id: 'id', senderId: 'senderId', text: 'text', timestamp: 123 })
        expect(mockDb.zadd).toHaveBeenCalledWith("chat:chatId:messages", { "member": "{\"id\":\"id\",\"senderId\":\"senderId\",\"text\":\"text\",\"timestamp\":123}", "score": 123 })
    })
})
