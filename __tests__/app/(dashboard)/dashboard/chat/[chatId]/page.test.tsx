import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'

import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import {db} from "@/lib/db"
import { JSX, ClassAttributes, ImgHTMLAttributes } from 'react';

jest.mock("@/lib/myGetServerSession", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
    db: {
        get: jest.fn(),
    },
}));

// eslint-disable-next-line react/display-name
jest.mock('next/image', () => (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />;
});

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe('ChatPage renders with expected content', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: "stub",
            id: "stub",
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
        expect(getByRole('img')).toBeInTheDocument();
    });

    test("chat image should be sourced from chat partner's name",async ()=>{
        (db.get as jest.Mock).mockResolvedValue({
            name: "stub",
            email: "stub",
            image: "https://i.kym-cdn.com/entries/icons/original/000/023/846/lisa.jpg",
            id: "stub",
        });

        const {getByRole} = render(await Page({params:{chatId: 'userid1--userid2'}}));
        const element = getByRole('img');
        expect(element).toHaveAttribute('src',
            expect.stringContaining("https://i.kym-cdn.com/entries/icons/original/000/023/846/lisa.jpg"));

    });
});
