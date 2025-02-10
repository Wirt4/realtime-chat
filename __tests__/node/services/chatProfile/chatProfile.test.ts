import { ChatProfileServce } from "@/services/chatProfile/implementation";

describe("Create Chat Id Tests", () => {
    it("The ID should be a string 74 chars long", () => {
        const chatProfileService = new ChatProfileServce();

        const id = chatProfileService.createChatId();

        expect(typeof id).toBe("string");
        expect(id.length).toBe(74);
    })
});
