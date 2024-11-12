import '@testing-library/jest-dom';
import {act, render, screen} from "@testing-library/react";
import Messages from "@/components/Messages";
import {Message} from "@/lib/validations/messages"
import React from "react";

import {getPusherClient, pusherClient} from "@/lib/pusher";

jest.mock('@/lib/pusher', () => ({
    getPusherClient: jest.fn(),
}))

describe('Messages renders with correct content', () => {
    test('renders with a div labeled "messages"', () => {
        const stubUser = {id:'stub', email:'stub', image: '/stub', name:'stub'}
        const participants = {
            partner: stubUser,
            user: stubUser,
            sessionId:'stub'
        }
        const {getByLabelText} = render(<Messages initialMessages={[]} participants={participants}/>)
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
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} />)
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
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} />)
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
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} />)
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
        const {getByText} = render(<Messages initialMessages={[msg]} participants={participants} />)
        const span = getByText("My name's Gypsy. What's yours?")
        expect(span).toHaveClass(/bg-blue/i)
        expect(span).toHaveClass(/text-white/i)
    })
})

describe('Messages listens to pusher events', ()=>{
    const initialMessages = [
        { id: '1', senderId: 'user1', text: 'Hello', timestamp: 1627417600000 },
    ]
    const sessionId = 'user1'
    const chatId = 'user1--user2'
    const sessionImg = '/session-img-url'
    const chatPartner = { id: 'user2', image: '/partner-img-url', email: 'stub', name:'stub' }

    test('Given the component has been initialized with one message: When the pusher client is triggered, ' +
        'then the page should subscribe to thechannel "chat__user1--user2"', async () => {
        const mockPusherClient = {
            subscribe: jest.fn(),
        };

        (getPusherClient as jest.Mock).mockReturnValue(mockPusherClient);

        const participants = {
            partner: chatPartner,
            user: {id: chatId, email:'stub', image: sessionImg, name: 'stub'},
            sessionId
        }

        render(<Messages initialMessages={initialMessages} participants={participants}/>)

        expect(mockPusherClient.subscribe).toHaveBeenCalledWith(
            'chat__user1--user2'
        )
    })
})

