import Helpers, {StateSetters} from "@/components/ChatInput/helpers";
import React from "react";
import axios from "axios";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HandleKeystroke tests', () => {
    let helpers: Helpers
    let sendMessageSpy: jest.SpyInstance
    beforeEach(() => {
        jest.resetAllMocks()
        const s = {
            setInput: jest.fn(),
            setIsLoading: jest.fn(),
            reference: jest.fn()
        } as unknown as StateSetters
        helpers = new Helpers(s, 'stub')
        sendMessageSpy = jest.spyOn(helpers, 'SendMessage')
        mockedAxios.post.mockImplementation(jest.fn());
    })
    test('key is Enter, prevent default is called',()=>{
        const event = keyEvent('Enter')
        helpers.HandleKeystroke(event, 'stub')
        expect(event.preventDefault).toHaveBeenCalled()
    })

    test('key is Enter, sendMessage is called',()=>{
        const event = keyEvent('Enter')
        helpers.HandleKeystroke(event, 'stub')
        expect(sendMessageSpy).toHaveBeenCalled()
    })

    test('key is not Enter, prevent default not called',()=>{
        const event = keyEvent('Tab')
        helpers.HandleKeystroke(event, 'stub')
        expect(event.preventDefault).not.toHaveBeenCalled()
    })

    test('key is not Enter, SendMessage is not called',()=>{
        const event = keyEvent('Tab')
        helpers.HandleKeystroke(event, 'stub')
        expect(sendMessageSpy).not.toHaveBeenCalled()
    })

    test('key is Enter + shift, prevent default is not called',()=>{
        const event = keyEvent('Enter')
        event.shiftKey = true
        helpers.HandleKeystroke(event, 'stub')
        expect(event.preventDefault).not.toHaveBeenCalled()
    })

    test('key is Enter + shift, SendMessage is not called',()=>{
        const event = keyEvent('Enter')
        event.shiftKey = true
        helpers.HandleKeystroke(event, 'stub')
        expect(sendMessageSpy).not.toHaveBeenCalled()
    })
})

describe('SendMessage tests', () => {
    let helpers: Helpers
    let setIsLoading:  React.Dispatch<React.SetStateAction<boolean>>

    beforeEach(()=>{
        jest.resetAllMocks();
        setIsLoading = jest.fn()
        const s = {
            setInput: jest.fn(),
            setIsLoading,
            reference: jest.fn()
        } as unknown as StateSetters
        helpers = new Helpers(s, 'stub')
        mockedAxios.post.mockImplementation(jest.fn());
    })

    test('setter should be called with true', async ()=>{
        await helpers.SendMessage('stub')
        expect(setIsLoading).toHaveBeenCalledWith(true)
    })

    test('axios post should be called with endpoint /api/message/send', async ()=>{
        await helpers.SendMessage('stub')
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/message/send', expect.anything());
    })

    test('axios post should be called with payload {text: input}', async ()=>{
        const input = 'Never give up. Never surrender'
        await helpers.SendMessage(input)
        expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({text:input}));
    })

    test('axios post should be called with payload {text: input}, different data', async ()=>{
        const input = 'I am and always will be your friend'
        await helpers.SendMessage(input)
        expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({text:input}));
    })

    test('axios post should be called with chatId: juliet--romeo', async ()=>{
        const input = 'I am and always will be your friend'
        const chatId = 'juliet--romeo'
        const s = {setInput: jest.fn(), setIsLoading: jest.fn()} as unknown as StateSetters
        helpers = new Helpers(s, chatId)
        await helpers.SendMessage(input)
        expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({chatId: chatId}));
    })

    test('axios post should be called with chatId: gorignack--jason', async ()=>{
        const input = 'I am and always will be your friend'
        const chatId = 'gorignack--jason'
        const s = {setInput: jest.fn(), setIsLoading: jest.fn()} as unknown as StateSetters
        helpers = new Helpers(s, chatId)
        await helpers.SendMessage(input)
        expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({chatId: chatId}));
    })

    test ('second call to setIsLoading should be  "false"', async ()=>{
        await helpers.SendMessage('stub')
        expect(setIsLoading).toHaveBeenCalledWith(false)
    })

    test ('even if post throws, setIsLoading should still call  "false"', async ()=>{
        mockedAxios.post.mockImplementation(()=>{ throw new Error('error') });
        await helpers.SendMessage('stub')
        expect(setIsLoading).toHaveBeenCalledWith(false)
    })

    test ('when axios post completes, clear the field', async ()=>{
        const clearInputSpy = jest.spyOn(helpers, 'clearInput')
        await helpers.SendMessage('stub')
        expect(clearInputSpy).toHaveBeenCalled()
    })

    test ('when axios post completes, setFocus', async ()=>{
        const setFocus = jest.spyOn(helpers, 'setFocus')
        await helpers.SendMessage('stub')
        expect(setFocus).toHaveBeenCalled()
    })
})

describe('clearInput tests', ()=>{
    let helpers: Helpers
    let setInputSpy: jest.Mock

    beforeEach(() => {
        jest.resetAllMocks()
        setInputSpy = jest.fn()
        const s = {
            setInput: setInputSpy,
            setIsLoading: jest.fn(),
            reference: jest.fn()
        } as unknown as StateSetters
        helpers = new Helpers(s, 'stub')
    })

    test('setInput should be called with an empty string',()=>{
        helpers.clearInput()
        expect(setInputSpy).toHaveBeenCalledWith('')
    })
})

describe('SetFocus tests',()=>{
    let helpers: Helpers
    let reference: {current:{focus: jest.Mock}}
    let focusSpy: jest.Mock
    beforeEach(() => {
        jest.resetAllMocks()
        focusSpy = jest.fn()
        reference = {current:{focus: focusSpy}}
        const s = {setInput: jest.fn, setIsLoading: jest.fn(), reference: reference} as unknown as StateSetters
        helpers = new Helpers(s, 'stub')
    })

    test('setFocus should call the reference current.focus',()=>{
        helpers.setFocus();
        expect(focusSpy).toHaveBeenCalled()
    })

})

const keyEvent=(key: string) =>{
    return {
        key: key,
        preventDefault: jest.fn()
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>
}
