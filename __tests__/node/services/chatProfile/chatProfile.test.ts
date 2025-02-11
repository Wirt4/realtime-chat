import { ChatProfileServce } from "@/services/chatProfile/implementation";

describe("Create Chat Id Tests", () => {
    let service: ChatProfileServce;
    beforeEach(() => {
        service = new ChatProfileServce();
    });
    it("The ID should be a string 74 chars long", () => {
        const id = service.createChatId();

        expect(typeof id).toBe("string");
        expect(id.length).toBe(74);
    })
    it("The IDs should be unique", () => {
        const id1 = service.createChatId();
        const id2 = service.createChatId();

        expect(id1).not.toEqual(id2);
    })
    it("The two middle chars should be hypens", () => {
        const id = service.createChatId();

        expect(id[36]).toBe("-");
        expect(id[37]).toBe("-");
    })
});
