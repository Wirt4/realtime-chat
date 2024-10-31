import '@testing-library/jest-dom';
import { render} from "@testing-library/react";
import Messages from "@/components/Messages";
import {Message} from "@/lib/validations/messages"
import React from "react";

describe('Messages renders with correct content', () => {
    test('renders with a div labeled "messages"', () => {
        const {getByLabelText} = render(<Messages initialMessages={[]} sessionId="stub"/>)
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
        const {getByText} = render(<Messages initialMessages={[msg]} sessionId='stub'/>)
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
        const {getByText} = render(<Messages initialMessages={[msg]} sessionId='stub'/>)
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
        const {getByText} = render(<Messages initialMessages={[msg]} sessionId={sessionId}/>)
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
        const {getByText} = render(<Messages initialMessages={[msg]} sessionId={sessionId}/>)
        const span = getByText("My name's Gypsy. What's yours?")
        expect(span).toHaveClass(/bg-blue/i)
        expect(span).toHaveClass(/text-white/i)
    })
})
