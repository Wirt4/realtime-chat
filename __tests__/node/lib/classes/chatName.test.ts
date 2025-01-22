import { ChatName } from '@/lib/classes/chatName/implementation';

describe('ChatName tests', () => {
    it('rshould return a default title but not include the users name', () => {
        const participants: User[] = [
            { name: "Alfred", id: "foo", email: "bar", image: "/spam" },
            { name: "theUser", id: "bar", email: "bar", image: "/spam" },
            { name: "Betty", id: "foo", email: "bar", image: "/spam" },
            { name: "Charlie", id: "foo", email: "bar", image: "/spam" },
        ]
        const sessionId = "bar";
        const chatName = new ChatName(participants, sessionId);
        expect(chatName.getChatName()).toEqual("Chat with Alfred, Betty, and Charlie");
    })
    it('rshould return a default title but not include the users name', () => {
        const participants: User[] = [
            { name: "Alfred", id: "bar", email: "bar", image: "/spam" },
            { name: "theUser", id: "foo", email: "bar", image: "/spam" },
            { name: "Betty", id: "foo", email: "bar", image: "/spam" },
            { name: "Charlie", id: "foo", email: "bar", image: "/spam" },
        ]
        const sessionId = "bar";
        const chatName = new ChatName(participants, sessionId);
        expect(chatName.getChatName()).toEqual("Chat with Betty, Charlie, and theUser");
    })
})
