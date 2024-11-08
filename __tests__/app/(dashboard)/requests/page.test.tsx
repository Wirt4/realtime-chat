import '@testing-library/jest-dom'
import {render, screen} from "@testing-library/react";
import Page from '@/app/(dashboard)/dashboard/requests/page'
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {notFound} from "next/navigation";
import fetchRedis from "@/helpers/redis";
import FriendRequests from "@/components/FriendRequests/FriendRequests";

jest.mock("../../../../src/helpers/redis",()=> jest.fn());
jest.mock("@/components/FriendRequests/FriendRequests",()=> jest.fn());
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    notFound: jest.fn(),
}));

describe('Request page', () => {
    beforeEach(()=>{
        (getServerSession as jest.Mock).mockResolvedValue(null);
        (fetchRedis as jest.Mock).mockResolvedValue([]);
    });

    afterEach(()=>{
        jest.resetAllMocks()
    });

    test('getServerSession should be called with the parameter AuthOptions',async ()=>{
        render(await Page({}));
        expect(getServerSession as jest.Mock).toHaveBeenCalledWith(authOptions);
    });

    test('if the session is falsy, call "notFound"', async ()=>{
        render(await Page({}));
        expect(notFound as jest.Mock).toHaveBeenCalled()
    });

    test('if the session is valid, do not call "notFound"', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'valid'}})
        render(await Page({}));
        expect(notFound as jest.Mock).not.toHaveBeenCalled()
    });

    test('should render a FriendRequests component',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'valid'}})
        render(await Page({}));
        expect((FriendRequests as Jest.Mock)).toHaveBeenCalled();
    });

    test('should display the words "Friend Requests',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'valid'}})
        render(await Page({}));
        const header = screen.getByText('Friend Requests');
        expect(header).toBeInTheDocument();
    });
});
