import {Submissions} from "@/lib/submissions"

describe("Submissions", () => {
    beforeAll(()=>{
        jest.spyOn(Submissions, 'addFriend')
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('method addFriend should be called with the email member of FormData 1',()=>{
        const email = "foo@bar.com"
        Submissions.handleSubmit({email})
        expect(Submissions.addFriend).toHaveBeenCalledWith(email)
    })
    test('method addFriend should be called with the email member of FormData 2',()=>{
        const email = "bar@foo.com"
        Submissions.handleSubmit({email})
        expect(Submissions.addFriend).toHaveBeenCalledWith(email)
    })
})