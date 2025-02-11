import { ChatProfileService } from "@/services/chatProfile/implementation";
describe("ChatProfileService", () => {

    test('CreateChat Test should call idGenerator.create()', async () => {
        const mockIdGenerator = {
            newId: jest.fn()
        }
        const chatProfileService = new ChatProfileService(mockIdGenerator);

        await chatProfileService.createChat();

        expect(mockIdGenerator.newId).toHaveBeenCalledTimes(1);
    })
});
