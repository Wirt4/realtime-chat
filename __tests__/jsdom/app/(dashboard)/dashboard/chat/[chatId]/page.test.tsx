import '@testing-library/jest-dom'

import { render } from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import { notFound } from "next/navigation";
import myGetServerSession from '@/lib/myGetServerSession';

jest.mock("@/app/api/friends/remove/route");
jest.mock('@/lib/pusher', () => ({
    getPusherClient: jest.fn(),
}))

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

jest.mock("@/lib/myGetServerSession", () => jest.fn());

describe('ChatPage renders with expected content', () => {
    let testId: string;
    beforeEach(() => {
        jest.resetAllMocks();
        testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567"
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('page renders', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).not.toHaveBeenCalled();
    });
    test("if chatId is empty, notFound is called", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        render(await Page({ params: { chatId: "" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if chatId is invalid formatting , notFound is called", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        render(await Page({ params: { chatId: "badformatting" } }));
        expect(notFound).toHaveBeenCalled();
    });
})
