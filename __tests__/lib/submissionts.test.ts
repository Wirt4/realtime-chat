import {Submissions} from "@/lib/submissions"
jest.spyOn(Submissions, 'addFriend')
describe("Submissions", () => {
    afterEach(()=>{
        jest.resetAllMocks()
    })
    test('method addFriend should be called with the email member of FormData',()=>{
        const email = "foo@bar.com"
        Submissions.handleSubmit({email})
        expect(Submissions.addFriend).toHaveBeenCalledWith(email)
    })
    test('method addFriend should be called with the email member of FormData',()=>{
        const email = "bar@foo.com"
        Submissions.handleSubmit({email})
        expect(Submissions.addFriend).toHaveBeenCalledWith(email)
    })
})