import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/dashboard/add/page"
import {render} from "@testing-library/react"

jest.mock('../../../../src/components/AddFriendButton', () => ({
    __esModule: true,
    default: () => <div data-testid="friend-button"/>
}));

describe('Add Page tests',()=>{
   test('Document should instruct you to add a friend',  ()=>{
       const {getByText} = render(<Page/>);
       expect(getByText('Add a Friend')).toBeInTheDocument();
    });

    test('needs to contain an add-friends button',()=>{
        const {getByTestId} = render(<Page/>);
        expect(getByTestId('friend-button')).toBeInTheDocument()
    });
});
