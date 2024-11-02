import '@testing-library/jest-dom'
import {render} from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import {Helpers} from '@/app/(dashboard)/dashboard/chat/[chatId]/helpers';
import Messages from "@/components/Messages";

import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import {db} from "@/lib/db"
import ChatInput from "@/components/ChatInput/ChatInput";
import {Utils} from "@/lib/utils";

jest.mock("@/components/Messages",() => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock("@/components/ChatInput/ChatInput",() => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock("@/lib/myGetServerSession", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
    db: {
        get: jest.fn(),
    },
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe('ChatPage renders with expected content', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'userid1'}});
        (db.get as jest.Mock).mockResolvedValue({
            name: "partner name",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });
        jest.spyOn(Helpers.prototype, "getChatMessages").mockResolvedValue([]);
        (ChatInput as jest.Mock).mockReturnValue(<div aria-label='chat input'/> )
    });
    test('page renders',async ()=>{
        render(await Page({params:{chatId: 'userid1--userid2'}}));
    });

    test('If the session is null, the page call notfound page',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValueOnce(null);

        render(await Page({params:{chatId: 'userid1--userid2'}}));

        expect(notFound).toHaveBeenCalled();
    });

    test("If the session is valid, then the page doesn't call notfound page", async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});

        render(await Page({params:{chatId: 'stub--stub'}}));

        expect(notFound).not.toHaveBeenCalled();
    });

    test('If the user is not a participant in the conversation, then the page calls notFound',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{session:{id:'1701'}}});

        render(await Page({params:{chatId: 'userid1--userid2'}}));

        expect(notFound).toHaveBeenCalled();
    });

    test('chat page should render with an image',async ()=>{
        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const image = getByRole('img');
        expect(image).toBeInTheDocument();
    });

    test("chat image should be sourced from chat partner's ID",async ()=>{
        const url = "/uglyImage";
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: url,
            id: "stub",
        });

        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const element = getByRole('img');
        expect(element).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl(url)));
    });

    test("chat image should be sourced from chat partner's name, different data",async ()=>{
        const url = "/fancyImage";
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: url,
            id: "stub",
        });

        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const element = getByRole('img');
        expect(element).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl(url)));
    });

    test("chat image should have alt text for partner's name", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "fooey",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });

        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}))
        const element = getByRole('img');
        expect(element).toHaveAttribute('alt',
            expect.stringContaining('fooey'));
    })

    test("chat image should have alt text for partner's name", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "alice",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });

        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}))
        const element = getByRole('img');
        expect(element).toHaveAttribute('alt',
            expect.stringContaining('alice'));
    })

    test('user is valid, but not for the chat', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'userid1'}});
        render(await Page({params:{chatId: 'userid2--userid3'}}));

        expect(notFound).toHaveBeenCalled();
    })

    test("document should display chat partner's name", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "alice",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });

        const {getByText} = render(await Page({params:{chatId: 'useri12--userid2'}}));
        const name = getByText('alice')

        expect(name).toBeInTheDocument();
    })

    test("document should display chat partner's name", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });

        const {getByText} = render(await Page({params:{chatId: 'userid21-userid2'}}));
        const name = getByText('spock')

        expect(name).toBeInTheDocument();
    })

    test("document should display chat partner's email",async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "spock@vulcanscience.edu",
            image: "/stub",
            id: "userid2",
        });

        const {getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const email = getByText("spock@vulcanscience.edu")
        expect(email).toBeInTheDocument();
    })

    test("document should display chat partner's email",async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "scooby@doo.com",
            image: "/stub",
            id: "userid2",
        });

        const {getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const email = getByText("scooby@doo.com")
        expect(email).toBeInTheDocument();
    })

    test("document should contain a messages component",async ()=>{
        (Messages as jest.Mock).mockReturnValue(<div aria-label="messages" className="message-scroll"></div>)
        const {queryByLabelText} = render(await Page({params: {chatId: 'userid1--userid2'}}));
        const messages = queryByLabelText('messages')
        expect(messages).toBeInTheDocument();
    })

    test('document should contain a ChatInput component',async ()=>{
        const {getByLabelText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const chatInput = getByLabelText('chat input')
        expect(chatInput).toBeInTheDocument();
    })
});

describe('Chat page makes expected calls', ()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: "/stub",
            id: "stub",
        });
        jest.spyOn(Helpers.prototype, 'getChatMessages').mockResolvedValue([]);
    });

    test('Will get info for both users: ensure db is called with correct params',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});

        render(await Page({params:{chatId: 'kirk--spock'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:spock');
        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:kirk');
    })

    test('ill get info for both users: ensure db is called with correct params, different data',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:mork');
        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:mindy');
    })

    test('Messages is called with the output of getChatMessages and correct session id',async ()=>{
        const msgs = [{
            id: 'stub',
            senderId:'stub',
            text: 'Hello World',
            timestamp: 0
        }]
        jest.spyOn(Helpers.prototype, 'getChatMessages').mockResolvedValue(msgs);

        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'mork'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));
        expect(Messages as jest.Mock).toHaveBeenCalledWith(
            expect.objectContaining({initialMessages:msgs, participants:
                    expect.objectContaining({sessionId:'mork'})}),
            {})
    });

    test('Messages is called with the output of getChatMessages and correct session id, different data',async ()=>{
        const msgs = [{
            id: 'stub',
            senderId:'stub',
            text: "My name's Gypsy, What's yours?",
            timestamp: 0
        }]
        jest.spyOn(Helpers.prototype, 'getChatMessages').mockResolvedValue(msgs);

        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));
        expect(Messages as jest.Mock).toHaveBeenCalledWith(
            expect.objectContaining({initialMessages:msgs, participants:
                    expect.objectContaining({sessionId:'mindy'})}),
            {})
    })

    test('confirm getChatMessages is called with the chatId', async()=>{
        const spy =  jest.spyOn(Helpers.prototype, 'getChatMessages').mockResolvedValue([]);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));

        expect(spy).toHaveBeenCalledWith('mindy--mork');
    })

    test('confirm getChatMessages is called with the chatId, different data', async()=>{
        const spy =  jest.spyOn(Helpers.prototype, 'getChatMessages').mockResolvedValue([]);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'gimli'}});

        render(await Page({params:{chatId: 'gimli--legolas'}}));

        expect(spy).toHaveBeenCalledWith('gimli--legolas');
    })

    test('confirm ChatInput is called with chat partner data', async()=>{
        const expected = {
            name: "prettyBow",
            email: "mithril@forest.com",
            image: "/prettystub",
            id: "legolas"
        };
        (db.get as jest.Mock).mockResolvedValue(expected);
        render(await Page({params:{chatId: 'gimli--legolas'}}));

        expect(ChatInput as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({chatPartner:expected}), expect.anything());
    });

    test('confirm ChatInput is called with chat partner data, different data', async()=>{
        const expected = {
            name: "mightyAx",
            email: "iron@caves.com",
            image: "/hairystub",
            id: "gimli"
        };
        (db.get as jest.Mock).mockResolvedValue(expected);
        render(await Page({params:{chatId: 'gimli--legolas'}}));

        expect(ChatInput as jest.Mock).toHaveBeenCalledWith(expect.objectContaining({chatPartner:expected}), expect.anything());
    })
})
