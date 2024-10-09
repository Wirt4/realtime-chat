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
    test('setStatus true if axios and validated email resolve', ()=>{
        (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
        (addFriendValidator.parse as jest.Mock).mockResolvedValue(true)

        const spy = jest.fn()
        const email = "bar@foo.com"
        const props ={
            data: {email},
            showSuccessState: spy,
        }
        Submissions.addFriend(props)

        expect(spy).toHaveBeenCalledWith(true)
    })
})