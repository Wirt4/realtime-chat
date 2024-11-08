import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import { useState } from 'react';
import PusherClientHandler from "@/components/friendRequestSidebarOptions/helpers";

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

jest.spyOn(PusherClientHandler.prototype, 'subscribeToPusher').mockImplementation(jest.fn());

describe('FriendRequestSidebarOptions', () => {
    let subscribeSpy: jest.SpyInstance;
    beforeEach(()=>{
        (useState as jest.Mock).mockImplementation(()=>{ return [0, jest.fn()]});
        subscribeSpy = jest.spyOn(PusherClientHandler.prototype, 'subscribeToPusher');
    });
    afterEach(()=>{
        jest.clearAllMocks();
    })

    test('Component renders without error', ()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
    });

    test('Component contains a link', ()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });

    test('Link points to /dashboard/requests', ()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/dashboard/requests');
    });

    test('Component should contain User Icon',()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const name = screen.getByLabelText('User');
        expect(name).toBeInTheDocument();
    });

    test('Component should contain text "Friend Requests"',()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const label = screen.getByText("Friend Requests");
        expect(label).toBeInTheDocument();
    });

    test('If final count is greater than 0, display it',()=>{
        (useState as jest.Mock).mockImplementation(()=>{ return [3, jest.fn()]});
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={2}/>);
        const label = screen.queryByText("3");
        expect(label).toBeInTheDocument();
    });

    test('If count is greater than 0, display it, different number',()=>{
        (useState as jest.Mock).mockImplementation(()=>{ return [7, jest.fn()]});
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={4}/>);
        const label = screen.queryByText("7");
        expect(label).toBeInTheDocument();
    });

    test("If count is equal to 0,  don't display it",()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={5}/>);
        const label = screen.queryByText("0")
        expect(label).not.toBeInTheDocument();
    });

    test("If count is less than  0,  don't display it",()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={-50}/>);
        const label = screen.queryByText("-50")
        expect(label).not.toBeInTheDocument();
    });

    test("confirm Helpers() has been called",()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={-50}/>);
        expect(subscribeSpy).toHaveBeenCalledTimes(1);
    });
});
