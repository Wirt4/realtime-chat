import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import SidebarChatList from '@/components/SidebarChatList';
import SidebarChatListItem from '@/components/SidebarChatListItem';
import {useState} from 'react'

jest.mock('@/components/SidebarChatListItem');
jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

describe('SidebarChatList', () => {
    beforeEach(()=>{
        (useState as jest.Mock).mockImplementation(()=>{ return [[], jest.fn()]});
    })
    afterEach(()=>{
        jest.resetAllMocks();
    })
    test('confirm component renders',()=>{
        render(<SidebarChatList friends={[]}/>);
    });

    test('component should be or have a role of list',()=>{
        const {queryByRole} = render(<SidebarChatList friends={[]}/>);
        const list = queryByRole('list');
        expect(list).toBeInTheDocument();
    });

    test('component should call SidebarChatListItem in order',()=>{
        const activeChats = [{
            name: 'Boris',
            email: 'karloff@spoooky.com',
            image: 'stub',
            id: '12345'
        },{
            name: 'Bela',
            email: 'lugosi@hungary.eu',
            image: 'stub',
            id: '54321'
        }];
        (useState as jest.Mock).mockReturnValue([activeChats, jest.fn()]);
        const childComponentSpy = jest.fn();
        (SidebarChatListItem as jest.Mock).mockImplementation(({ friend }) => {
            childComponentSpy(friend);
            return <div data-testid="child-component">Mocked Child</div>;
        });


        render(<SidebarChatList friends={[]}/>);

        expect(childComponentSpy.mock.calls).toEqual([
            [{
                name: 'Bela',
                email: 'lugosi@hungary.eu',
                image: 'stub',
                id: '54321'
            }],
            [{
               name: 'Boris',
               email: 'karloff@spoooky.com',
               image: 'stub',
               id: '12345'
            }]
            ]);
    });

    test('component should call SidebarChatListItem with correct number of unseen messages',()=>{
        let useStateCount =0;
        (useState as jest.Mock).mockImplementation(()=>{
            useStateCount++;
            if (useStateCount === 1) {
                const activeChats = [{
                    name: 'Bela',
                    email: 'lugosi@hungary.eu',
                    image: 'stub',
                    id: '54321'
                }]
                return [activeChats, jest.fn];
            }
            const unreadMessages = [{
                id: "foo",
                senderId:"54321",
                text: "Welcome",
                timestamp:
                    1729437427
            }]
            return [unreadMessages, jest.fn]

        });
        const childComponentSpy = jest.fn();
        (SidebarChatListItem as jest.Mock).mockImplementation((props) => {
            childComponentSpy(props);
            return <div data-testid="child-component">Mocked Child</div>;
        });

        render(<SidebarChatList friends={[]}/>);

        expect(childComponentSpy).toHaveBeenCalledWith({
            friend:{
                name: 'Bela',
                email: 'lugosi@hungary.eu',
                image: 'stub',
                id: '54321'
            },
            unseenMessages: 1
        });
    });

    test('component should call SidebarChatListItem with correct number of unseen messages, different data',()=>{
        let useStateCount =0;
        (useState as jest.Mock).mockImplementation(()=>{
            useStateCount++;
            if (useStateCount === 1) {
                const activeChats = [{
                    name: 'Sherlock',
                    email: 'elementarary@detective.uk',
                    image: 'stub',
                    id: '221b'
                }]
                return [activeChats, jest.fn];
            }
            const unreadMessages = [{
                id: "foo",
                senderId:"221b",
                text: "Hmmmmm",
                timestamp:
                    1729437427
            },
                {
                    id: "foo",
                    senderId:"221b",
                    text: "Interesting",
                    timestamp:
                        1729437000
                }]
            return [unreadMessages, jest.fn]

        });
        const childComponentSpy = jest.fn();
        (SidebarChatListItem as jest.Mock).mockImplementation((props) => {
            childComponentSpy(props);
            return <div data-testid="child-component">Mocked Child</div>;
        });

        render(<SidebarChatList friends={[]}/>);

        expect(childComponentSpy).toHaveBeenCalledWith(expect.objectContaining({unseenMessages: 2}));
    });

    test('component should call SidebarChatListItem with correct number of unseen messages, different data',()=>{
        let useStateCount =0;
        (useState as jest.Mock).mockImplementation(()=>{
            useStateCount++;
            if (useStateCount === 1) {
                const activeChats = [{
                    name: 'Sherlock',
                    email: 'elementarary@detective.uk',
                    image: 'stub',
                    id: '221b'
                },
                    {
                    name: 'Bela',
                    email: 'lugosi@hungary.eu',
                    image: 'stub',
                    id: '54321'
            },
                    {
                        name: 'Ahab',
                        email: 'captain@pequod.com',
                        image: 'stub',
                        id: '666'
                    }]
                return [activeChats, jest.fn];
            }
            const unreadMessages = [{
                id: "foo",
                senderId:"221b",
                text: "Hmmmmm",
                timestamp:
                    1729437427
            },
                {
                    id: "foo",
                    senderId:"221b",
                    text: "Interesting",
                    timestamp:
                        1729437000
                },
                {id:"stub",senderId:"54321", text: 'blah', timestamp:0},
                {id:"stub",senderId:"54321", text: 'blah', timestamp:0},
                {id:"stub",senderId:"54321", text: 'blah', timestamp:0}]
            return [unreadMessages, jest.fn]

        });
        const childComponentSpy = jest.fn();
        (SidebarChatListItem as jest.Mock).mockImplementation((props) => {
            childComponentSpy(props);
            return <div data-testid="child-component">Mocked Child</div>;
        });

        render(<SidebarChatList friends={[]}/>);

        expect(childComponentSpy).toHaveBeenCalledWith(expect.objectContaining({unseenMessages: 2, friend:expect.objectContaining({name: "Sherlock"})}));
    });
});
