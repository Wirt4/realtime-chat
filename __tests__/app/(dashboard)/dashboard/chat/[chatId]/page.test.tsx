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
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{session:{id:'valid session'}}});
    });

    test('page renders',async ()=>{
        render(await Page({params:{chatId: 'stub'}}));
    });

    test('If the session is null, the page call notfound page',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValueOnce(null);

        render(await Page({params:{chatId: 'stub'}}));

        expect(notFound).toHaveBeenCalled();
    });

    test("If the session is valid, then the page doesn't call notfound page", async ()=>{
        render(await Page({params:{chatId: 'stub'}}));

        expect(notFound).not.toHaveBeenCalled();
    });
});
