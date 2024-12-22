import {MessageService} from "@/services/message/service";

describe('isChatMember tests', ()=>{
    it('user is a part of the chat',()=>{
        const chatId = "bar--foo"
        const userId = "foo"
        const service = new MessageService()
        expect(service.isChatMember(userId, chatId)).toEqual(true)
    })
    it('user is not a part of the chat',()=>{
        const chatId = "bar--foo"
        const userId = "batman"
        const service = new MessageService()
        expect(service.isChatMember(userId, chatId)).toEqual(false)
    })
})
