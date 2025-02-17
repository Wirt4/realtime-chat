import '@testing-library/jest-dom'

import { render } from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import { notFound } from "next/navigation";
import myGetServerSession from '@/lib/myGetServerSession';
import axios from "axios";

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

jest.mock("@/lib/myGetServerSession", () => jest.fn());
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChatPage renders with expected content', () => {
    let testId: string;
    beforeEach(() => {
        jest.resetAllMocks();
        testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        mockedAxios.get.mockResolvedValue({ data: { members: new Set(['userid1', 'userid2']), id: testId } });
    });


    test('page renders', async () => {
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).not.toHaveBeenCalled();
    });
    test("if chatId is empty, notFound is called", async () => {
        render(await Page({ params: { chatId: "" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if chatId is invalid formatting , notFound is called", async () => {
        render(await Page({ params: { chatId: "badformatting" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if session is null, notFound is called", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("axios.GET should be called with api/chatprofile/getprofile?id=<chatId>", async () => {
        render(await Page({ params: { chatId: testId } }));
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('api/chatprofile/getprofile?id='));
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(testId));
    });
    test("if api/chatprofile/getprofile?id=<chatId> resoves to null, then not fount", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: null });
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).toHaveBeenCalled();
    });
})
