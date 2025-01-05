import {MessageRepository} from "@/repositories/message/respository";
import {Redis} from "@upstash/redis";

describe('repository.sendMessage tests',()=>{
    let mockDb: Redis
    let repository: MessageRepository
    beforeEach(()=>{
        mockDb = {
            zadd: jest.fn()
        } as unknown as Redis
        repository = new MessageRepository(mockDb )
    })
    it('zadd should be called on database',async ()=>{
        await repository.sendMessage('chatId', {id: 'id', senderId: 'senderId', text: 'text', timestamp: 123})
        expect(mockDb.zadd).toHaveBeenCalled()
    })
    it('check arguments passed to zadd',async ()=>{
        await repository.sendMessage('chatId', {id: 'id', senderId: 'senderId', text: 'text', timestamp: 123})
        expect(mockDb.zadd).toHaveBeenCalledWith( "chat:chatId:messages", {"member": "{\"id\":\"id\",\"senderId\":\"senderId\",\"text\":\"text\",\"timestamp\":123}", "score": 123})
    })
})

describe('repository.removeAllMessages tests',()=>{
    it('check arguments passed to database.del',()=>{
        const mockDb: Redis = {
            del: jest.fn()
        } as unknown as Redis
        const repository = new MessageRepository(mockDb)
        repository.removeAllMessages('foo--bar')
        expect(mockDb.del).toHaveBeenCalledWith('chat:foo--bar:messages')
    })
})
