import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/add/page"
import {getServerSession} from "next-auth"
import {Auth} from "@/lib/auth"

jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}))

jest.mock("../../../../src/lib/auth.ts", () => ({
    Auth:{
        options: jest.fn()
    }
}))

describe('Get Server Session test',()=>{
    let mockGetServerSession: jest.Mock
    beforeEach(()=>{
        mockGetServerSession = getServerSession as jest.Mock
        mockGetServerSession.mockResolvedValue({})
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })

   test('page should call getServerSession', async ()=>{
        await Page({})
       expect(mockGetServerSession).toHaveBeenCalledTimes(1)
    })

    test ('getServerSession should be called with the auth.Options', async ()=>{
        const opts = {providers: []}
        jest.spyOn(Auth, 'options').mockReturnValueOnce(opts)

        await Page({})
        expect(mockGetServerSession).toHaveBeenCalledWith(opts)
    })

})

