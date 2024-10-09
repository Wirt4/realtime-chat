import {PostFriendsRouteHandler} from "@/app/api/friends/add/route";
import {addFriendValidator} from "@/lib/validations/add-friend";

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
})
