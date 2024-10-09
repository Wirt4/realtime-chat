import {Submissions} from "@/lib/submissions"
jest.mock('axios')
jest.mock('../../src/lib/validations/add-friend')


describe("handleSubmit", () => {
    let sub: Submissions

    beforeEach(()=>{
        sub = new Submissions()
        jest.spyOn(sub, 'addFriend')
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
        sub.handleSubmit(props)
        expect(sub.addFriend).toHaveBeenCalledWith(props)
    })
    test('method addFriend should be called with the email member of FormData 2',()=>{
        const email = "bar@foo.com"
        const props = {showSuccessState: jest.fn, data:{email}}
        sub.handleSubmit(props)
        expect(sub.addFriend).toHaveBeenCalledWith(props)
    })
})

describe('addFriend',()=>{
    let goodAxios: { data: { success: boolean; }; }
    let sub: Submissions
    beforeAll(()=>{
        sub = new Submissions()
        goodAxios = { data: { success: true } }
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('setStatus true if axios and validated email resolve', async ()=>{
        // @ts-expect-error parital payload resolve
        jest.spyOn(sub,'postToAxios').mockResolvedValue(goodAxios)
        jest.spyOn(sub, 'validate').mockReturnValue({email: 'validEmail'})

        const spy = jest.fn()
        const email = "bar@foo.com"
        const props ={
            data: {email},
            showSuccessState: spy,
        }
        await sub.addFriend(props)

        expect(spy).toHaveBeenCalledWith(true)
    })
    test("setStatus not called if axios throws", async () => {
        jest.spyOn(sub, 'postToAxios').mockRejectedValue(new Error("API Error"));
        jest.spyOn(sub, 'validate').mockReturnValue({email:'validEmail'});

        const spy = jest.fn();
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: spy,
        };

        await sub.addFriend(props);

        expect(spy).not.toHaveBeenCalled();
    });
    test("setStatus not called if friendValidator throws", async () => {
        //@ts-expect-error partial resolved value
        jest.spyOn(sub, 'postToAxios').mockResolvedValue(goodAxios);
        jest.spyOn(sub, 'validate').mockImplementation(()=>{
            throw new Error("bad");
        })

        const spy = jest.fn();
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: spy,
        };

        await sub.addFriend(props);

        expect(spy).not.toHaveBeenCalled();
    })
    test(' expect axios to be called with correct path', async ()=>{
        const path = '/api/friends/add'
        //@ts-expect-error partial resolved value
        const spy = jest.spyOn(sub, "postToAxios").mockResolvedValue(goodAxios)
        jest.spyOn(sub, 'validate').mockReturnValueOnce({email: 'validEmail'})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await sub.addFriend(props);
        expect(spy).toHaveBeenCalledWith(path, expect.anything())
    })
    test(' expect axios to be called with correct opts', async ()=>{
        //@ts-expect-error partial resolved value
        const spy = jest.spyOn(sub, "postToAxios").mockResolvedValue(goodAxios)
        const validEmail = 'validated email'
        jest.spyOn(sub, 'validate').mockReturnValueOnce({email:validEmail})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await sub.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email:{email: validEmail}})
    })
    test(' expect axios to be called with correct opts', async ()=>{
        // @ts-expect-error partial resolved value
        const spy = jest.spyOn(sub, "postToAxios").mockResolvedValue(goodAxios)
        const validEmail='scooby@doo.com'
        jest.spyOn(sub, 'validate').mockReturnValueOnce({email: validEmail})
        const email = "bar@foo.com";
        const props = {
            data: { email },
            showSuccessState: jest.fn,
        };
        await sub.addFriend(props);
        expect(spy).toHaveBeenCalledWith(expect.anything(), {email: {email: validEmail}})
    })
})