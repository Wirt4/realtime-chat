import '@testing-library/jest-dom'

import { render } from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import { notFound } from "next/navigation";
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { getPusherClient } from "@/lib/pusher";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    let testId = "abc123abc123abc123abc123abc123abc1--def456def456def456def456def456def4"
    beforeEach(() => {
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        mockedAxios.get.mockImplementation(jest.fn());
    });

    test('page renders', async () => {
        render(await Page({ params: { chatId: testId } }));
    });
    test("if chatId is empty, notFound is called", async () => {
        render(await Page({ params: { chatId: "" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if chatId is invalid formatting , notFound is called", async () => {
        render(await Page({ params: { chatId: "bad formatting" } }));
        expect(notFound).toHaveBeenCalled();
    });
})
