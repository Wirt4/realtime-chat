import {Submissions} from "@/lib/submissions"
jest.spyOn(Submissions, 'addFriend')
describe("Submissions", () => {
    test('method addFriend should be called with the email member of FormData',()=>{
        const email = "foo@bar.com"
        Submissions.handleSubmit({email})
        expect(Submissions.addFriend).toHaveBeenCalledWith(email)
    })
})