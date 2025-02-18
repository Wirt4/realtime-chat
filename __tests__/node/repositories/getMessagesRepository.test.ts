
import { GetMessagesRepository } from '@/repositories/message/get/implementation';
import { getMessageRepositoryFactory } from '@/repositories/message/get/factory';

jest.mock('@/repositories/message/get/factory');

describe('getMessagesRepository', () => {
    let zrangeSpy: jest.Mock;
    let repo: GetMessagesRepository;
    beforeEach(() => {
        jest.resetAllMocks();
        zrangeSpy = jest.fn().mockResolvedValue(['{"id":"stub","senderId":"stub","timestamp":123,"text":"Hello World"}']);
        (getMessageRepositoryFactory as jest.Mock).mockReturnValue({ zrange: zrangeSpy });
        repo = new GetMessagesRepository();
    })

    it('should call zrange with correct query', async () => {
        await repo.getMessages('chat--id');

        expect(zrangeSpy).toHaveBeenLastCalledWith("chat:chat--id:messages", expect.anything(), expect.anything());
    });
    it('should call zrange with correct ordering', async () => {
        await repo.getMessages('chat--id');

        expect(zrangeSpy).toHaveBeenLastCalledWith(expect.anything(), 0, -1);
    });
    it('if the database returns an empty array, then return an empty array', async () => {
        zrangeSpy.mockResolvedValue([]);

        const result = await repo.getMessages('chat--id');

        expect(result).toEqual([]);
    });
    it('if the database returns data that is not parsable by JSON throw an error', () => {
        zrangeSpy.mockResolvedValue(['not json']);

        expect(repo.getMessages('chat--id')).rejects.toThrow(new Error('database returned invalid message format'));
    });
    it('if the database returns data that is parsable by JSON, but does not fid the schema, then throw', async () => {
        //missing timestamp value
        zrangeSpy.mockResolvedValue(['{"senderId":"stub","receiverId":"bar","text":"Hello World"}']);

        expect(repo.getMessages('chat--id')).rejects.toThrow(new Error('database returned invalid message format'));
    });
    it('if the database returns data that is parsable by JSON, and fits the schema, then return the parsed data', async () => {
        const result = await repo.getMessages('chat--id');

        expect(result).toEqual([{
            senderId: "stub",
            id: "stub",
            timestamp: 123,
            text: "Hello World"
        }]);
    })
})
