import '@testing-library/jest-dom'

import {fireEvent, render, act} from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import {notFound} from "next/navigation";
import {db} from "@/lib/db"
import { getServerSession } from 'next-auth';
import {Utils} from "@/lib/utils";
import fetchMock from "jest-fetch-mock";
import {getPusherClient} from "@/lib/pusher";
import axios from "axios";

jest.mock("axios",()=>({
    post: jest.fn()
}));

jest.mock('@/lib/db', () => ({
    db: {
        get: jest.fn(),
    },
}));

jest.mock("@/app/api/friends/remove/route");
jest.mock('@/lib/pusher', () => ({
    getPusherClient: jest.fn(),
}))

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('ChatPage renders with expected content', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        fetchMock.resetMocks();
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'userid1'}});
        (db.get as jest.Mock).mockResolvedValue({
            name: "partner name",
            email: "stub",
            image: "/stub",
            id: "userid2",
        });
        fetchMock.mockResponseOnce(JSON.stringify({ result: [] }));
        (getPusherClient as jest.Mock).mockReturnValue({
            subscribe: jest.fn().mockReturnValue({bind:jest.fn(), unbind: jest.fn()}),
            unsubscribe: jest.fn()
        });
    });

    test('page renders',async ()=>{
        render(await Page({params:{chatId: 'userid1--userid2'}}));
    });

    test("If the session is valid, then the page doesn't call notfound page", async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        render(await Page({params:{chatId: 'stub--stub'}}));
        expect(notFound).not.toHaveBeenCalled();
    });

    test('If the session is null, the page call notfound page',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue(null);
        render(await Page({params:{chatId: 'userid1--userid2'}}));
        expect(notFound).toHaveBeenCalled();
    });

    test('If the user is not a participant in the conversation, then the page calls notFound',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{session:{id:'1701'}}});
        render(await Page({params:{chatId: 'userid1--userid2'}}));
        expect(notFound).toHaveBeenCalled();
    });

    test('If the user is not a participant in the conversation, then the page calls notFound',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{session:{id:'1701'}}});
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
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'userid1'}});
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
        const {queryByLabelText} = render(await Page({params: {chatId: 'userid1--userid2'}}));
        const messages = queryByLabelText('messages')
        expect(messages).toBeInTheDocument();
    })

    test('document should contain a ChatInput component',async ()=>{
        const {getByLabelText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const chatInput = getByLabelText('chat input')
        expect(chatInput).toBeInTheDocument();
    });

    test("Given the message contains a partner's image  when the image is clicked on, Then the page should contain a link with an X icon that reads 'Remove Friend'.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {queryByText, getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const picture = getByRole('img');
        fireEvent.click(picture);
        expect(queryByText('Remove Friend')).toBeInTheDocument();
    })

    test("Given the message contains a partner's image  when the page is first rendered, Then the page should not contain a link with an X icon that reads 'Remove Friend'.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {queryByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        expect(queryByText('Remove Friend')).not.toBeInTheDocument();
    })

    test("Given the message contains a partner's image and  the image has been clicked: when that image is clicked again , Then the page should contain a link with an X icon that reads 'Remove Friend'.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {queryByText, getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const picture = getByRole('img');
        fireEvent.click(picture);
        expect(queryByText('Remove Friend')).toBeInTheDocument();

        fireEvent.click(picture);
        expect(queryByText('Remove Friend')).not.toBeInTheDocument();
    })

    test("Given the message contains a partner's name  when the name is clicked on, Then the page should contain a link with an X icon that reads 'Remove Friend'.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {queryByText, getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const name = getByText('spock');
        fireEvent.click(name);
        expect(queryByText('Remove Friend')).toBeInTheDocument();
    })

    test("Given the message contains a partner's name and is clicked on, When the 'Remove Friend' option is clicked, the api endpoint '/friends/remove' is called.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const name = getByText('spock');
        fireEvent.click(name);
        const button = getByText('Remove Friend');

        await act( ()=>{
            fireEvent.click(button);
        })

        expect(axios.post as jest.Mock).toHaveBeenCalledWith('/api/friends/remove', expect.anything());
    })

    test("Given the message contains a partner's name and is clicked on, When the 'X' option is clicked, the api endpoint '/friends/remove' is called.", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });
        const {getByLabelText, getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const name = getByText('spock');
        fireEvent.click(name);
        const button = getByLabelText('x');

        await act(()=>{
            fireEvent.click(button);
        });

        expect(axios.post as jest.Mock).toHaveBeenCalledWith('/api/friends/remove', expect.anything());
    })

    test("Given the message contains a partner's name and is clicked on, When the 'X' option is clicked, the api endpoint '/api/message/remove/all' is called with the chatId 'userid1--userid2'", async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "spock",
            email: "pon@far.com",
            image: "/stub",
            id: "userid2",
        });

        const {getByLabelText, getByText} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const name = getByText('spock');
        fireEvent.click(name);
        const button = getByLabelText('x');

        await act(()=>{
            fireEvent.click(button);
        });

        expect(axios.post as jest.Mock).toHaveBeenCalledWith('/api/message/remove/all', {chatId: 'userid1--userid2'});
    })
});

describe('Chat page makes expected calls', ()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        fetchMock.resetMocks();
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: "/stub",
            id: "stub",
        });
        fetchMock.mockResponseOnce(JSON.stringify({ result: [] }));
        (getPusherClient as jest.Mock).mockReturnValue({
            subscribe: jest.fn().mockReturnValue({bind:jest.fn(), unbind: jest.fn()}),
            unsubscribe: jest.fn()
        });
    });

    test('Will get info for both users: ensure db is called with correct params',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});

        render(await Page({params:{chatId: 'kirk--spock'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:spock');
        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:kirk');
    })

    test('ill get info for both users: ensure db is called with correct params, different data',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:mork');
        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:mindy');
    })

    test('Given an array of messages returned from Redis When the page component is created then expect to see the information in the doc',async ()=>{
        const msgs = [JSON.stringify({
            id: 'stub',
            senderId:'mork',
            text: 'Hello World',
            timestamp: 0
        })]
        fetchMock.resetMocks()
        fetchMock.mockResponseOnce(JSON.stringify({ result: msgs }));

        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'mork'}});

        const {getByText} = render(await Page({params:{chatId: 'mindy--mork'}}));
        const component = getByText('Hello World')
        expect(component).toBeInTheDocument()
    });

    test('Messages is called with the output of getChatMessages and correct session id, different data',async ()=> {
        const msgs = [JSON.stringify({
            id: 'stub',
            senderId: 'stub',
            text: "My name's Gypsy, What's yours?",
            timestamp: 0
        })]
        fetchMock.resetMocks()
        fetchMock.mockResponseOnce(JSON.stringify({result: msgs}));

        (getServerSession as jest.Mock).mockResolvedValue({user: {id: 'mindy'}});

        const {getByText} = render(await Page({params: {chatId: 'mindy--mork'}}));

        const msgtext = getByText("My name's Gypsy, What's yours?")
        expect(msgtext).toBeInTheDocument()
    })

    test('confirm fetch is called with url containing the chatId', async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ result: [] }));
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('mindy--mork'), expect.anything());
    })

    test('confirm fetch is called with url containing the chatId, different data', async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ result: [] }));
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'gimli'}});

        render(await Page({params:{chatId: 'gimli--legolas'}}));

        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('gimli--legolas'), expect.anything());
    })

    test('confirm ChatInput is called with chat partner data', async()=> {
        const expected = {
            name: "prettyBow",
            email: "mithril@forest.com",
            image: "/prettystub",
            id: "legolas"
        };
        (db.get as jest.Mock).mockResolvedValue(expected);
        const {getByPlaceholderText} = render(await Page({params: {chatId: 'gimli--legolas'}}));
        const placeholder = getByPlaceholderText('Send prettyBow a message')

        expect(placeholder).toBeInTheDocument();
    })

    test('confirm ChatInput is called with chat partner data, different data', async()=>{
        const expected = {
            name: "mightyAx",
            email: "iron@caves.com",
            image: "/hairystub",
            id: "gimli"
        };
        (db.get as jest.Mock).mockResolvedValue(expected);
        const {getByPlaceholderText} = render(await Page({params:{chatId: 'gimli--legolas'}}));

        const placeholder = getByPlaceholderText('Send mightyAx a message')

        expect(placeholder).toBeInTheDocument();
    })
})
