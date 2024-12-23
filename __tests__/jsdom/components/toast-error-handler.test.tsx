import {render, screen} from "@testing-library/react";
import ToastErrorHandler from "@/components/ToastErrorHandler";
import '@testing-library/jest-dom'

jest.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="mocked-toaster" />
}));
describe('Providers', () => {
    test('needs to contain a toaster',()=>{
        const {getByTestId} = render(<ToastErrorHandler>null</ToastErrorHandler>)
        expect(getByTestId('mocked-toaster')).toBeInTheDocument()
    })
    test('renders the children passed to it',()=>{
        render(<ToastErrorHandler><p>My Names June. Whats Yours?</p></ToastErrorHandler>)
        expect(screen.getByText('My Names June. Whats Yours?')).toBeInTheDocument();
    })
})
