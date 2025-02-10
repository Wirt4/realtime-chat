import { ChatProfileServce } from "@/services/chatProfile/implementation";

describe("Create Chat Id Tests", () => {
    it("The ID should be a string 74 chars long", () => {
        const chatProfileService = new ChatProfileServce();

        const id = chatProfileService.createChatId();

        expect(typeof id).toBe("string");
        expect(id.length).toBe(74);
    })
    it("The IDs should be unique", () => {
        const chatProfileService = new ChatProfileServce();

        const id1 = chatProfileService.createChatId();
        const id2 = chatProfileService.createChatId();

        expect(id1).not.toEqual(id2);
    })
});
