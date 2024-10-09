import {Submissions} from "@/lib/submissions"
describe("Submissions", () => {
    test('method addFriend should be called with the email member of FormData',()=>{
        const email = "foo@bar.com"
        Submissions.handleSubmit({email})
        const spy = jest.spyOn(Submissions, 'addFriend')
        expect(spy).toHaveBeenCalledWith(email)
    })
})