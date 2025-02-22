import { MessageValidator } from "@/services/message/validator/implementation";
import { Utils } from "@/lib/utils";
import { SenderHeader } from "@/schemas/senderHeaderSchema";

jest.mock("@/lib/utils");

describe("MessageValidator", () => {
    let validator: MessageValidator;

    beforeEach(() => {
        validator = new MessageValidator();
    });

    describe("validateChatId", () => {
        it("should not throw an error for a valid chatId", () => {
            (Utils.isValidChatId as jest.Mock).mockReturnValue(false);
            expect(() => validator.validateChatId("validChatId")).not.toThrow();
        });

        it("should throw an error for an empty chatId", () => {
            expect(() => validator.validateChatId("")).toThrow("Invalid chatId");
        });

        it("should throw an error if Utils.isValidChatId returns true", () => {
            (Utils.isValidChatId as jest.Mock).mockReturnValue(true);
            expect(() => validator.validateChatId("invalidChatId")).toThrow("Invalid chatId");
        });
    });

    describe("validateMessageText", () => {
        it("should not throw an error for a valid text", () => {
            expect(() => validator.validateMessageText("Hello!")).not.toThrow();
        });

        it("should throw an error for an empty text", () => {
            expect(() => validator.validateMessageText("")).toThrow("Invalid message text");
        });
    });

    describe("validateProfile", () => {
        it("should not throw an error for a valid SenderHeader", () => {
            const validProfile: SenderHeader = { id: "123", sender: "user1" };
            expect(() => validator.validateProfile(validProfile)).not.toThrow();
        });

        it("should throw an error for an invalid SenderHeader", () => {
            const invalidProfile = { id: "123" }; // Missing "sender" field
            expect(() => validator.validateProfile(invalidProfile as SenderHeader)).toThrow("Invalid chat profile");
        });
    });

    describe("validateMessageArray", () => {
        it("should not throw an error for a valid message array", () => {
            const messages = [
                { id: "1", senderId: "user1", text: "Hello", timestamp: 1625159072, receiverId: "user2" },
                { id: "2", senderId: "user2", text: "Hi", timestamp: 1625159080, receiverId: "user2" }
            ];
            expect(() => validator.validateMessageArray(messages)).not.toThrow();
        });

        it("should throw an error for an invalid message array", () => {
            const invalidMessages = [
                { id: "1", senderId: "user1", text: "Hello" } // Missing timestamp
            ];
            expect(() => validator.validateMessageArray(invalidMessages as any)).toThrow("Repository error, invalid format");
        });
    });
});
