import {Utils} from "@/lib/utils"
import {addFriendValidator} from "@/lib/validations/add-friend";
import {z, ZodError, ZodIssueCode} from "zod";
import axios, {AxiosError} from 'axios'

jest.mock('axios')

describe('classNames test', ()=>{
    test('want to make sure the inputs are passed to clsx', ()=>{
        const spy = jest.spyOn(Utils, '_cslx')
        Utils.classNames(['Tom', 'Dick', 'Harry'])
        expect(spy).toHaveBeenCalledWith([['Tom', 'Dick', 'Harry']])
    })

    test('want to make sure the inputs are passed to clsx', ()=>{
        const spy = jest.spyOn(Utils, '_cslx')
        Utils.classNames(['Blanche', 'Dorothy', 'Rose'])
        expect(spy).toHaveBeenCalledWith([['Blanche', 'Dorothy', 'Rose']])
    })

    test('want to make sure the results of cslx are passed to twMerge', ()=>{

        jest.spyOn(Utils, '_cslx').mockReturnValueOnce('my what a lovely return')
        const spy = jest.spyOn(Utils, '_twMerge')
        Utils.classNames(['Blanche', 'Dorothy', 'Rose'])
        expect(spy).toHaveBeenCalledWith('my what a lovely return')
    })

    test('the method should return the results of _twMerge', ()=>{
        jest.spyOn(Utils, '_cslx').mockReturnValueOnce('my what a lovely return')
        jest.spyOn(Utils, '_twMerge').mockReturnValueOnce("That's my final answer, Regis")
        expect(Utils.classNames(['Blanche', 'Dorothy', 'Rose'])).toEqual("That's my final answer, Regis")
    })
})

describe('buttonClassNames test', ()=>{
    test('should return the results of classNames', ()=>{
        jest.spyOn(Utils, 'classNames').mockReturnValueOnce('ta-daa')
        expect(Utils.buttonClassNames({})).toEqual('ta-daa')
    })

    test('should return the results of classNames, different data', ()=>{
        jest.spyOn(Utils, 'classNames').mockReturnValueOnce("Here's looking at you kid")
        expect(Utils.buttonClassNames({})).toEqual("Here's looking at you kid")
    })

    test('expect classNames to be called with the output of _buttonVariants', ()=>{
        jest.spyOn(Utils, '_buttonVariants').mockReturnValueOnce("Here's looking at you kid")
        const spy = jest.spyOn(Utils, 'classNames').mockReturnValueOnce('stub')
        Utils.buttonClassNames({})
        expect(spy).toHaveBeenCalledWith("Here's looking at you kid")
    })
})

describe('loginwithGoogle',()=>{
    beforeEach(()=>{
        jest.spyOn(Utils, '_signIn').mockImplementation(jest.fn())
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('The dependency injection should be called with "true, then false"', async()=>{
        const spy = jest.fn()
        const func = Utils.loginWithGoogle(spy)
        await func()
        expect(spy.mock.calls).toEqual([[true], [false]])
    })

    test("_signin should be called with 'google'",async ()=>{
        const spy = jest.spyOn(Utils, '_signIn').mockImplementation(jest.fn())
        const func = Utils.loginWithGoogle(()=>{})
        await func()
        expect(spy).toHaveBeenCalledWith('google')
    })

    test('The dependency injection should be called with "true, then false", even is _signin throws', async()=>{
        jest.spyOn(Utils, '_signIn').mockRejectedValueOnce('error')
        const spy = jest.fn()
        const func = Utils.loginWithGoogle(spy)
        await func()
        expect(spy.mock.calls).toEqual([[true], [false]])
    })

    test('if _signin throws, call toastErr with a message', async ()=>{
        jest.spyOn(Utils, '_signIn').mockRejectedValueOnce('error')
        const spy = jest.spyOn(Utils, 'toastError')
        const func = Utils.loginWithGoogle(()=>{})
        await func()
        expect(spy).toHaveBeenCalledWith('something went wrong with the login')
    })
    test('if _signin works okay, do not call toastError ', async ()=>{
        const spy = jest.spyOn(Utils, 'toastError')
        const func = Utils.loginWithGoogle(()=>{})
        await func()
        expect(spy).not.toHaveBeenCalled()
    })
})

describe('adFriend', ()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('validator.parse() is called', async ()=>{
        const spy = jest.spyOn(addFriendValidator, 'parse').mockReturnValue({email:'valid-email'})
        await Utils.addFriend({email:'valid-email', setError: jest.fn(), setShowSuccessState: jest.fn()})
        expect(spy).toHaveBeenCalledWith('valid-email')
    })
    test('validator.parse() throws, expect setEror to be called ', async ()=>{
        const issues: z.ZodIssue[] = [
            {
                code: ZodIssueCode.invalid_type,
                expected: "string",
                received: "number",
                path: ["name"],
                message: "Name must be a string",
            }
        ];
        const error = new ZodError(issues)
        jest.spyOn(addFriendValidator, 'parse').mockImplementation(()=>{
            throw error
        })

        const email = 'invalid-email'
        const spy = jest.fn()
        await Utils.addFriend({email, setError: spy, setShowSuccessState: jest.fn()})
        expect(spy).toHaveBeenCalledWith('email', { message: error.message })
    })
    test('axios.post should be called with the correct path and output of addFriendValidator.parse', async ()=>{
        const expectedPath = '/api/friends/add'
        const email = 'valid-email'
        const validEmail = {email}
        const expectedOpts = {email: validEmail}
        jest.spyOn(addFriendValidator, 'parse').mockReturnValue(validEmail)
        const postSpy = jest.spyOn(axios, 'post').mockResolvedValue({ data: { success: true } })
        await Utils.addFriend({email, setError: jest.fn(), setShowSuccessState: jest.fn()})
        expect(postSpy).toHaveBeenCalledWith(expectedPath, expectedOpts)

    })
    test('axios.post throws, setError should be called',async ()=>{
        const email = 'valid-email'
        const validEmail = {email}
        jest.spyOn(addFriendValidator, 'parse').mockReturnValue(validEmail)
        const axError = new AxiosError('you dun effed up')
        jest.spyOn(axios, 'post').mockRejectedValue(axError)
        const spy = jest.fn()
        await Utils.addFriend({email, setError: spy, setShowSuccessState: jest.fn()})
        expect(spy).toHaveBeenCalledWith('email', { message: axError.response?.data })
        expect(spy).toHaveBeenCalledTimes(1)
    })
    test('axios.post throws a generic, setError should be called',async ()=>{
        const email = 'valid-email'
        const validEmail = {email}
        jest.spyOn(addFriendValidator, 'parse').mockReturnValue(validEmail)
        const axError = new Error('Shoot, I dunno')
        jest.spyOn(axios, 'post').mockRejectedValue(axError)
        const spy = jest.fn()
        await Utils.addFriend({email, setError: spy, setShowSuccessState: jest.fn()})
        expect(spy).toHaveBeenCalledWith('email', { message: 'Something went wrong, check logs'})
    })
    test('axios.post and addFriendValidator.parse are clean, should call setShowSuccessState with true', async ()=>{
        const email = 'valid-email'
        const validEmail = {email}
        jest.spyOn(addFriendValidator, 'parse').mockReturnValue(validEmail)
        jest.spyOn(axios, 'post').mockResolvedValue({ data: { success: true } })
        const spy = jest.fn()
        await Utils.addFriend({email, setError: jest.fn(), setShowSuccessState: spy})
        expect(spy).toHaveBeenCalledWith( true)
    })
})