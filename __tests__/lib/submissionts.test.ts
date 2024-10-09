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
    test('method addFriend should be called with the email member of FormData 1',()=>{
        const email = "foo@bar.com"
        Submissions.handleSubmit({data: {email}, showSuccessState: jest.fn})
        expect(Submissions.addFriend).toHaveBeenCalledWith(
            expect.objectContaining({data:
                    expect.objectContaining({email})}))
    })
    test('method addFriend should be called with the email member of FormData 2',()=>{
        const email = "bar@foo.com"
        Submissions.handleSubmit({data: {email}, showSuccessState: jest.fn})
        expect(Submissions.addFriend).toHaveBeenCalledWith(
            expect.objectContaining({data:
                    expect.objectContaining({email})}))
    })
})

describe('addFriend',()=>{
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('setStatus true if axios and validated email resolve', (value: jest.ResolvedValue<T>)=>{
        (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
        (addFriendValidator.parse as jest.Mock).mockResolvedValue(true)

        const spy = jest.fn()
        const email = "bar@foo.com"
        Submissions.handleSubmit({data: {email}, showSuccessState:spy})

        expect(spy).toHaveBeenCalledWith(true)
    })
})