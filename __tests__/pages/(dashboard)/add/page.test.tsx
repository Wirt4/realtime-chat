import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/add/page"
import {render, screen} from "@testing-library/react"

jest.mock('../../../../src/components/AddFriendButton', () => ({
    __esModule: true,
    default: () => <div data-testid="friend-button"/>
}))

describe('Add Page tests',()=>{
   test('Document should instruct you to add a friend',  ()=>{
       const expected = 'Add a Friend'
       render(<Page/>)
       expect(screen.getByText(expected)).toBeInTheDocument()
    })
    test('needs to contain an add-friends button',()=>{
        const {getByTestId} = render(<Page/>)
        expect(getByTestId('friend-button')).toBeInTheDocument()
    })
})

