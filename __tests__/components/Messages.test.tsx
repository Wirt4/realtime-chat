import '@testing-library/jest-dom';
import {act, render, screen} from "@testing-library/react";
import Messages from "@/components/Messages";
import {Message} from "@/lib/validations/messages"
import React from "react";

import {getPusherClient} from "@/lib/pusher";

jest.mock('@/lib/pusher', () => ({
    getPusherClient: jest.fn(),
}))

describe('Messages renders with correct content', () => {
    beforeEach(()=>{
        (getPusherClient as jest.Mock).mockReturnValue({
            subscribe: jest.fn(),
        });
    })
    test('renders with a div labeled "messages"', () => {
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId:'stub'
        }
        const {getByLabelText} = render(<Messages initialMessages={[]} participants={participants} chatId='stub'/>)
        const div = getByLabelText('messages')
        expect(div).toBeInTheDocument();
    })
    test('a message passed to the component is on the screen',()=>{
        const msg: Message = {
            id: 'stub',
            senderId:'stub',
            text: 'Hello World',
            timestamp: 0
        }
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId:'stub'
        }
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants}chatId='stub' />)
        const div = getByText('Hello World')
        expect(div).toBeInTheDocument();
    })
    test('a message passed to the component is on the screen, different data',()=>{
        const msg: Message = {
            id: 'stub',
            senderId:'stub',
            text: "My name's Gypsy. What's yours?",
            timestamp: 0
        }
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId:'stub'
        }
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} chatId='stub'/>)
        const div = getByText("My name's Gypsy. What's yours?")
        expect(div).toBeInTheDocument();
    })
    test('if the message is from the sessionId, then display it with white text and a blue background',()=>{
        const msg: Message = {
            id: 'stub',
            senderId:'louise-99',
            text: "My name's Gypsy. What's yours?",
            timestamp: 0
        }

        const sessionId = 'louise-99'
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId
        }
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants}chatId='stub' />)
        const span = getByText("My name's Gypsy. What's yours?")
        expect(span).toHaveClass(/bg-orange/i)
        expect(span).toHaveClass(/text-white/i)
    })
    test('if the message is not from sessionId, then display it with dark grey text and a light grey background',()=>{
        const msg: Message = {
            id: 'stub',
            senderId:'louise-99',
            text: "My name's Gypsy. What's yours?",
            timestamp: 0
        }

        const sessionId = 'rose-16'
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId
        }
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} chatId='stub'/>)
        const span = getByText("My name's Gypsy. What's yours?")
        expect(span).toHaveClass(/bg-blue/i)
        expect(span).toHaveClass(/text-white/i)
    })
})

describe('Messages listens to pusher events', ()=>{
    const initialMessages = [
        { id: '1', senderId: 'user1', text: 'Hello', timestamp: 1627417600000 },
    ]
    let chatId = 'user1--user2'
    let sessionId = 'user1'
    let chatPartner = { id: 'user2', image: '/partner-img-url', email: 'stub', name:'stub' }
    let chatUser = {id: 'user1', email:'stub', image: '/user-img-url', name: 'stub'}
    beforeEach(()=>{
        jest.resetAllMocks()
    })
    test('Given the component has been initialized with user1--user2: When the component is rendered, ' +
        'then the page should subscribe to the channel "chat__user1--user2"', async () => {
        const mockPusherClient = {
            subscribe: jest.fn(),
        };

        (getPusherClient as jest.Mock).mockReturnValue(mockPusherClient);

        const participants = {
            partner: chatPartner,
            user: chatUser,
            sessionId
        }

        render(<Messages initialMessages={initialMessages} participants={participants} chatId={chatId} />)

        expect(mockPusherClient.subscribe).toHaveBeenCalledWith(
            'chat__user1--user2'
        )
    })

    test('Given the component has been initialized with the chat id adam--barbara: When the component is rendered, ' +
        'then the page should subscribe to the channel "chat__adam--barbara"', async () => {
        const mockPusherClient = {
            subscribe: jest.fn(),
        };
        sessionId = 'barbara'
        chatId = 'adam--barbara';
        chatPartner = {id: 'adam', email:'stub', image: '/user-img-url', name: 'stub'};
        chatUser = {id: 'barbara', email:'stub', image: '/user-img-url', name: 'stub'};


        (getPusherClient as jest.Mock).mockReturnValue(mockPusherClient);

        const participants = {
            partner: chatPartner,
            user: chatUser,
            sessionId
        };

        render(<Messages initialMessages={initialMessages} participants={participants} chatId={chatId}/>)

        expect(mockPusherClient.subscribe).toHaveBeenCalledWith(
            'chat__adam--barbara'
        )
    })

    test('Given the component has subscribed to the correct channel for chat: When the component is rendered, ' +
        'then the channel returned by subscribe should be bound to the event "incoming-message"', async ()=>{
        const bindMock = jest.fn();
        const mockPusherClient = {
            subscribe: jest.fn().mockReturnValue({bind: bindMock}),
        };

        (getPusherClient as jest.Mock).mockReturnValue(mockPusherClient);
        const participants = {
            partner: chatPartner,
            user: chatUser,
            sessionId
        };

        render(<Messages initialMessages={initialMessages} participants={participants} chatId={chatId}/>)
        expect(bindMock).toHaveBeenCalledWith('incoming_message', expect.anything())

    })
})

