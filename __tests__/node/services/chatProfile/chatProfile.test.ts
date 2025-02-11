import { ChatProfileService } from "@/services/chatProfile/implementation";

describe("Create Chat Id Tests", () => {
    let service: ChatProfileService;
    beforeEach(() => {
        service = new ChatProfileService();
    });
    it("The ID should be a string 74 chars long", () => {
        const id = service.createChat();

        expect(typeof id).toBe("string");
        expect(id.length).toBe(74);
    })
    it("The IDs should be unique", () => {
        const id1 = service.createChat();
        const id2 = service.createChat();

        expect(id1).not.toEqual(id2);
    })
    it("The two middle chars should be hypens", () => {
        const id = service.createChat();

        expect(id[36]).toBe("-");
        expect(id[37]).toBe("-");
    })
});
