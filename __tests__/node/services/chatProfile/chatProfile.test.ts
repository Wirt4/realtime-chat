import { ChatProfileService } from "@/services/chatProfile/implementation";
describe("ChatProfileService", () => {

    test('CreateChat Test should call idGenerator.create()', async () => {
        const mockIdGenerator = {
            newId: jest.fn()
        }
        const chatProfileService = new ChatProfileService(mockIdGenerator);

        await chatProfileService.createChat();

        expect(mockIdGenerator.newId).toHaveBeenCalledTimes(1);
    });

    test('If getChatId is called before create, then it should throw', async () => {
        const mockIdGenerator = {
            newId: jest.fn()
        }
        const chatProfileService = new ChatProfileService(mockIdGenerator);
        expect(() => chatProfileService.getChatId()).toThrow();
    });
    test('If getChatId is called before create, then it should throw', async () => {
        const mockIdGenerator = {
            newId: jest.fn().mockReturnValue("123")
        }
        const chatProfileService = new ChatProfileService(mockIdGenerator);

        await chatProfileService.createChat();

        expect(chatProfileService.getChatId()).toEqual("123");
    });
});
