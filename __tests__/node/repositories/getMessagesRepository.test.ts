
import { GetMessagesRepository } from '@/repositories/message/get/implementation';
import { getMessageRepositoryFactory } from '@/repositories/message/get/factory';

jest.mock('@/repositories/message/get/factory');

describe('getMessagesRepository', () => {
    it('should call zrange', async () => {
        const zrangeSpy = jest.fn();
        (getMessageRepositoryFactory as jest.Mock).mockReturnValue({ zrange: zrangeSpy });
        const repo = new GetMessagesRepository();

        await repo.getMessages('test');

        expect(zrangeSpy).toHaveBeenCalledTimes(1);
    })
    it('should call zrange with correct query', async () => {
        const zrangeSpy = jest.fn();
        (getMessageRepositoryFactory as jest.Mock).mockReturnValue({ zrange: zrangeSpy });
        const repo = new GetMessagesRepository();

        await repo.getMessages('chat--id');

        expect(zrangeSpy).toHaveBeenLastCalledWith("chat:chat--id:messages", expect.anything(), expect.anything());
    });
    it('should call zrange with correct ordering', async () => {
        const zrangeSpy = jest.fn();
        (getMessageRepositoryFactory as jest.Mock).mockReturnValue({ zrange: zrangeSpy });
        const repo = new GetMessagesRepository();

        await repo.getMessages('chat--id');

        expect(zrangeSpy).toHaveBeenLastCalledWith(expect.anything(), 0, -1);
    });
})
