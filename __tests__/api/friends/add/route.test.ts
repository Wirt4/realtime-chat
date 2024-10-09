import {PostFriendsRouteHandler} from "@/app/api/friends/add/route";
import {Utils} from "@/lib/utils";
import myGetServerSession from "@/lib/myGetServerSession"
import {pusherServer} from "@/lib/pusher";
jest.mock("../../../../src/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));


describe('Validate Tests - true verses false', () => {
    let handler: PostFriendsRouteHandler
    beforeEach(()=>{
        handler = new PostFriendsRouteHandler()
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test("email is invalid expect false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockImplementation(()=>{
            throw new Error('error')
        })
        const expected = {message:'Invalid request payload',
            opts: { status: 422 }
        }

       await handler.isValidRequest({email:'stupid invalid email'})
        expect(handler.errorResponse()).toEqual(expected)
    })

    test("user does not exist", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(false)
        const expected = {
            message:'This person does not exist.',
            opts: { status: 400 }
        }


       await handler.isValidRequest({email:'example@example.com'})
        expect(handler.errorResponse()).toEqual(expected)
    })
    test("session is unauthorized", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(false)
        const expected = {
            message:'unauthorized',
            opts: { status: 401 }
        }
        await handler.isValidRequest({email:'example@example.com'})
        expect(handler.errorResponse()).toEqual(expected)
    })

    test("user attempts to add self", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(true)
        const expected = {
            message:'You cannot add yourself as a friend',
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'})
        expect(handler.errorResponse()).toEqual(expected)
    })

    test("the target is already added", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(true)
        const expected = {
            message:'You\'ve already added this user',
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'})
        expect(handler.errorResponse()).toEqual(expected)
    })

    test("the target is already added", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(false)
        jest.spyOn(handler, 'areAlreadyFriends').mockResolvedValue(true)
        const expected = {
            message:"You're already friends with this user",
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'})
        expect(handler.errorResponse()).toEqual(expected)
    })

})

describe("error response tests",()=>{
    let handler: PostFriendsRouteHandler
    beforeEach(()=>{
        handler = new PostFriendsRouteHandler()
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test("email is invalid expect false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockImplementation(()=>{
            throw new Error('error')
        })

        const actual = await handler.isValidRequest({email:'stupid invalid email'})
        expect(actual).toEqual(false)
    })
    test("user does not exist", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(false)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("session is unauthorized", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(false)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("user attempts to add self", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("the target is already added", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("the target is already added", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(false)
        jest.spyOn(handler, 'areAlreadyFriends').mockResolvedValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
})

describe("Trigger Pusher tests", ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test("check the correct arguments have been passed to 'toPusherKey'",async ()=>{
        const handler = new PostFriendsRouteHandler()
        handler.idToAdd ='1701'
        const spy = jest.spyOn(Utils, 'toPusherKey')
        await handler.triggerPusher()
        expect(spy).toHaveBeenCalledWith('user:1701:incoming_friend_requests')
    })
    test("check the correct arguments have been passed to 'toPusherKey' 2",async ()=>{
        const handler = new PostFriendsRouteHandler()
        handler.idToAdd ='1984'
        const spy = jest.spyOn(Utils, 'toPusherKey')
        await handler.triggerPusher()
        expect(spy).toHaveBeenCalledWith('user:1984:incoming_friend_requests')
    })
    test("confirm idToAdd has been set by the session method",async ()=>{
        const handler = new PostFriendsRouteHandler()
        const expectedID = '1984';
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: expectedID}});
        await handler.getSession()
        expect(handler.idToAdd).toEqual(expectedID)
    })
    test("confirm idToAdd has been set by the session method",async ()=>{
        const handler = new PostFriendsRouteHandler()
        const expectedID = '1489';
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: expectedID}});
        await handler.getSession()
        expect(handler.idToAdd).toEqual(expectedID)
    })
    test("pusher server should get the output of the key as well as the user id and email",async ()=>{
        const handler = new PostFriendsRouteHandler()
        const spy = jest.spyOn(pusherServer, 'trigger')
        const expected1 ='valid-pusher-key'
        const expectedSenderId ="1972"
        const expectedSenderEmail = "tom@tomHagenLaw.com"
        handler.senderId = expectedSenderId
        handler.senderEmail = expectedSenderEmail

        jest.spyOn(Utils, 'toPusherKey').mockReturnValue(expected1)
        await handler.triggerPusher()
        expect(spy).toHaveBeenCalledWith(expected1,
            'incoming_friend_requests',
            {senderId: expectedSenderId, senderEmail:expectedSenderEmail}
        )
    })

})