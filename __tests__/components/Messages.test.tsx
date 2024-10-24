import '@testing-library/jest-dom';
import { render} from "@testing-library/react";
import Messages from "@/components/Messages";
import {Message} from "@/lib/validations/messages"
import React from "react";

describe('Messages renders with correct content', () => {
    test('renders with a div labeled "messages"', () => {
        const {getByLabelText} = render(<Messages initialMessages={[]}/>)
        const div = getByLabelText('messages')
        expect(div).toBeInTheDocument();
    })
    test('a message passed to the component is on the screen',()=>{
        const msg: Message = {
            id: 'stub',
            senderId:'stub',
            text: 'stub',
            timestamp: 0
        }
        const {getByText} = render(<Messages initialMessages={[msg]}/>)
        const div = getByText('Hello World')
        expect(div).toBeInTheDocument();
    })
})
