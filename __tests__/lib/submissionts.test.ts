import {Submissions} from "@/lib/submissions"
import axios from "axios";
import {addFriendValidator} from '@/lib/validations/add-friend'
jest.mock('axios')
jest.mock('../../src/lib/validations/add-friend')


describe("handleSubmit", () => {
    beforeAll(()=>{
        jest.spyOn(Submissions, 'addFriend')
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    afterAll(()=>{
        jest.restoreAllMocks()
    })
    test('method addFriend should be called with the email member of FormData 1',()=>{
        const email = "foo@bar.com"
        const props = {showSuccessState: jest.fn, data:{email}}
        Submissions.handleSubmit(props)
        expect(Submissions.addFriend).toHaveBeenCalledWith(props)
    })
    test('method addFriend should be called with the email member of FormData 2',()=>{
        const email = "bar@foo.com"
        const props = {showSuccessState: jest.fn, data:{email}}
        Submissions.handleSubmit(props)
        expect(Submissions.addFriend).toHaveBeenCalledWith(props)
    })
})

describe('addFriend',()=>{
    let goodAxios: { data: { success: boolean; }; }
    beforeAll(()=>{
        goodAxios = { data: { success: true } }
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('setStatus true if axios and validated email resolve', async ()=>{
        // @ts-expect-error parital payload resolve
        jest.spyOn(Submissions,'postToAxios').mockResolvedValue(goodAxios)
        jest.spyOn(Submissions, 'validate').mockReturnValue({email: 'validEmail'})

        const spy = jest.fn()
        const email = "bar@foo.com"
        const props ={
            data: {email},
            showSuccessState: spy,
        }
        await Submissions.addFriend(props)

        expect(spy).toHaveBeenCalledWith(true)
    })
    test("setStatus not called if axios throws", async () => {
        jest.spyOn(Submissions, 'postToAxios').mockRejectedValue(new Error("API Error"));
        jest.spyOn(Submissions, 'validate').mockReturnValue({email:'validEmail'});

        const spy = jest.fn();
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: spy,
        };

        await Submissions.addFriend(props);

        expect(spy).not.toHaveBeenCalled();
    });
    test("setStatus not called if friendValidator throws", async () => {
        jest.spyOn(Submissions, 'postToAxios').mockResolvedValue(goodAxios);
        jest.spyOn(Submissions, 'validate').mockImplementation(()=>{
            throw new Error("bad");
        })

        const spy = jest.fn();
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: spy,
        };

        await Submissions.addFriend(props);

        expect(spy).not.toHaveBeenCalled();
    })
    test(' expect axios to be called with correct path', async ()=>{
        const path = '/api/friends/add'
        //@ts-expect-error partial resolved value
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(goodAxios)
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce({email: 'validEmail'})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(path, expect.anything())
    })
    test(' expect axios to be called with correct opts', async ()=>{
        //@ts-expect-error partial resolved value
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(goodAxios)
        const validEmail = 'validated email'
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce({email:validEmail})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email:{email: validEmail}})
    })
    test(' expect axios to be called with correct opts', async ()=>{
        // @ts-expect-error partial resolved value
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(goodAxios)
        const validEmail='scooby@doo.com'
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce({email: validEmail})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email: {email: validEmail}})
    })
})