import {PostFriendsRouteHandler} from "@/app/api/friends/add/route";

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