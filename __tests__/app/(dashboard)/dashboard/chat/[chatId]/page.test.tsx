import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";

jest.mock("@/lib/myGetServerSession", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe('ChatPage tests', () => {
    test('page renders',async ()=>{
        render(await Page({params:{chatId: 'stub'}}));
    });

    test('If the session is null, the page call notfound page',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValueOnce(null);

        render(await Page({params:{chatId: 'stub'}}));
        
        expect(notFound).toHaveBeenCalled();
    });
});
