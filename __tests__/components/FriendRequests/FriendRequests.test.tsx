import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests/FriendRequests";
import {render, screen, waitFor, within, fireEvent} from "@testing-library/react";
import React from "react";
import axios from 'axios';
import {useRouter} from "next/navigation";
import subscribeToPusherClient from "@/components/FriendRequests/helpers"

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/components/FriendRequests/helpers", () => {
    return jest.fn()
});

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FriendRequests', () => {
    const requests1: FriendRequest []=  [
        {senderId:'foo', senderEmail: 'foo@bar.com'},
        {senderId: 'bar', senderEmail: 'bar@foo.com'}
    ];

    const requests2: FriendRequest [] = [
        {senderId:'foo', senderEmail: 'foo@bar.com'}
    ];

    const requests3: FriendRequest []  = [
        {senderId:'michael', senderEmail: 'michael@correlone.edu'},
        {senderId: 'sonny', senderEmail: 'santino@correlone.edu'},
        {senderId: 'fredo', senderEmail: 'fredo@correlone.edu'},
        {senderId: 'tom', senderEmail: 'foo@bar.com'}
    ];

    beforeEach(()=>{
        mockedAxios.post.mockImplementation(jest.fn());
        (useRouter as jest.Mock).mockReturnValue({
            refresh: jest.fn(),
        });
    });

    afterEach(()=>{
        jest.resetAllMocks()
    });

    test('final state of friend requests is 0, should render "Nothing to show here..." ',()=>{
        render(<FriendRequests incomingFriendRequests={[]} />);
        const text = screen.getByText('Nothing to show here...');
        expect(text).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(2);
    });

    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests2} />);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(1);
    });

    test('if (final) requests are greater than 0, do not render "Nothing to show here...',()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const text = screen.queryByText('Nothing to show here...');
        expect(text).not.toBeInTheDocument();
    });

    test('sender emails should be listed',()=>{
        const {queryByText} =render(<FriendRequests incomingFriendRequests ={requests1}/>);
        const button1 = queryByText('foo@bar.com');
        const button2 = queryByText('bar@foo.com');
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "accept friend"',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const buttons = screen.getAllByLabelText(/accept friend*/i);
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "accept friend" should be a button',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/accept friend*/i);
        expect(button.tagName).toBe('BUTTON');
    });

    test('accept friend should contain a checkmark',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/accept friend*/i);
        const check = within(button).getByLabelText('checkmark');
        expect(check).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "deny friend"',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const buttons = screen.getAllByLabelText(/deny friend*/i);
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "deny friend" should be a button',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/deny friend*/i);
        expect(button.tagName).toBe('BUTTON');
    });

    test('deny friend should contain a x',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/deny friend*/i);
        const check = within(button).getByLabelText('x');
        expect(check).toBeInTheDocument();
    });

    test('when accept friend is clicked, axios should be called with the endpoint /api/friends/accept',
        async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);

        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/accept', expect.anything());
        });
    });

    test('when accept friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);

        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });

    test('when accept friend is clicked, axios should be called with the opts {id: senderId}, different data',
        async ()=>{
        const {getByLabelText} =  render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);

        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });

    test('if accept friend is clicked,  current id should be removed from page',
        async ()=>{
            const {getByRole} = render(<FriendRequests incomingFriendRequests={requests3} />);
            const button = getByRole('button', {
                name: /accept friend: fredo@correlone.edu/i
            });

            fireEvent.click(button);

            await waitFor(()=>{
                expect( screen.queryByText('fredo@correlone.edu')).not.toBeInTheDocument();
                expect( screen.queryByText('santino@correlone.edu')).toBeInTheDocument();
                expect( screen.queryByText('michael@correlone.edu')).toBeInTheDocument();
            });
        });

    test('when accept friend is clicked, should refresh the page', async ()=>{
        const spy = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: spy
        });

        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests2} />);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(spy).toHaveBeenCalled();
        });
    });

    test('when deny friend is clicked, axios should be called with /api/friends/deny', async ()=>{
            const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests2} />);
            const button = getByLabelText(/deny friend*/i);
            fireEvent.click(button);
            await waitFor(()=>{
                expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/deny', expect.anything());
            });
        });

    test('when deny friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests2} />);
        const button = getByLabelText(/deny friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });

    test('when deny friend is clicked, axios should be called with the opts {id: senderId}, different data',
        async ()=>{
            const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests2} />);
            const button = getByLabelText(/deny friend*/i);
            fireEvent.click(button);
            await waitFor(()=>{
                expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
            });
        });

    test('if deny friend is clicked, current sender id should be removed',
        async ()=>{
            const {getByRole} = render(<FriendRequests incomingFriendRequests={requests3} />);
            const button = getByRole('button', {
                name: /deny friend: fredo@correlone.edu/i
            });

            fireEvent.click(button);

            await waitFor(()=>{
                expect( screen.queryByText('fredo@correlone.edu')).not.toBeInTheDocument();
                expect( screen.queryByText('santino@correlone.edu')).toBeInTheDocument();
                expect( screen.queryByText('michael@correlone.edu')).toBeInTheDocument();
            });
        });

    test('when deny friend is clicked, should refresh the page', async ()=>{
        const spy = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: spy,
        });

        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests2} />);
        const button = getByLabelText(/deny friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(spy).toHaveBeenCalled();
        });
    });
});

describe('FriendRequest realtime functionality', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (subscribeToPusherClient as jest.Mock).mockImplementation(jest.fn());
    });

    test('Rendering the component should call UseEffect', ()=>{
        const useEffectSpy = jest.spyOn(React, 'useEffect')
        render(<FriendRequests incomingFriendRequests={[]} />);
        expect (useEffectSpy).toHaveBeenCalled();
    });

    test('The rendered component should be called with method subscribeToPusherClient',()=>{
        const useEffectSpy = jest.spyOn(React, 'useEffect');
        render(<FriendRequests incomingFriendRequests={[]} />);
        expect (useEffectSpy).toHaveBeenCalledWith(subscribeToPusherClient, expect.anything());
    });
});
