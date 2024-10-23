import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'

import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import {db} from "@/lib/db"

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
            expect.stringContaining(encodeUrl(url)));
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
            expect.stringContaining(encodeUrl(url)));
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
    });

    test('db is called with correct params for user',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});

        render(await Page({params:{chatId: 'kirk--spock'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:spock');
    })

    test('db is called with correct params for user',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'spock'}});

        render(await Page({params:{chatId: 'kirk--spock'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:kirk');
    })

    test('db is called with correct params for user',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'mindy'}});

        render(await Page({params:{chatId: 'mindy--mork'}}));

        expect(db.get as jest.Mock).toHaveBeenCalledWith('user:mork');
    })
})


const encodeUrl = (url: string)=>{
    return url.replaceAll(':','%3A').replaceAll('/','%2F').replaceAll(',','%2C');
}
