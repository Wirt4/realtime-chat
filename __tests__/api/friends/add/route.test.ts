import {PostFriendsRouteHandler} from "@/app/api/friends/add/route";

describe('Validate Tests', () => {
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test("email is invalid expect false", async()=>{
        const handler = new PostFriendsRouteHandler()
        jest.spyOn(handler, 'validateEmail').mockImplementation(()=>{
            throw new Error('error')
        })

        const actual = await handler.isValidRequest({email:'stupid invalid email'})
        expect(actual).toEqual(false)
    })
    test("user does not exist", async()=>{
        const handler = new PostFriendsRouteHandler()
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(false)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("session is unauthorized", async()=>{
        const handler = new PostFriendsRouteHandler()
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(false)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("user attempts to add self", async()=>{
        const handler = new PostFriendsRouteHandler()
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("the target is already added", async()=>{
        const handler = new PostFriendsRouteHandler()
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("the target is already added", async()=>{
        const handler = new PostFriendsRouteHandler()
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
