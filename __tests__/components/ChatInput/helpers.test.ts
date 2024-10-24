import {sendMessage} from "@/components/ChatInput/helpers";
import React from "react";

describe('SendMessage tests', () => {
    test('key is Enter, prevent default is called',()=>{
        const event = keyEvent('Enter')
        sendMessage(event)
        expect(event.preventDefault).toHaveBeenCalled()

    })

    test('key is not Enter, prevent default not called',()=>{
        const event = keyEvent('Tab')
        sendMessage(event)
        expect(event.preventDefault).not.toHaveBeenCalled()
    })

    test('key is Enter + shift, prevent default is not called',()=>{
        const event = keyEvent('Enter')
        event.shiftKey = true
        sendMessage(event)
        expect(event.preventDefault).not.toHaveBeenCalled()
    })
})

const keyEvent=(key: string) =>{
    return {
        key: key,
        preventDefault: jest.fn()
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>
}
