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
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('setStatus true if axios and validated email resolve', async ()=>{
        (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
        (addFriendValidator.parse as jest.Mock).mockReturnValue(true)

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
        (axios.post as jest.Mock).mockRejectedValue(new Error("API Error"));
        (addFriendValidator.parse as jest.Mock).mockReturnValue(true);

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
        (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
        (addFriendValidator.parse as jest.Mock).mockImplementation(()=>{
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
        // @ts-ignore
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(true)
        // @ts-ignore
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce('true')
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(path, expect.anything())
    })
    test(' expect axios to be called with correct opts', async ()=>{
        // @ts-ignore
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(true)
        const validEmail = 'validated email'
        // @ts-ignore
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce(validEmail)
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email:validEmail})
    })
    test(' expect axios to be called with correct opts', async ()=>{
        // @ts-ignore
        const spy = jest.spyOn(Submissions, "postToAxios").mockResolvedValue(true)
        const validEmail='scooby@doo.com'
        // @ts-ignore
        jest.spyOn(Submissions, 'validate').mockReturnValueOnce(validEmail)
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await Submissions.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email: validEmail})
    })
})