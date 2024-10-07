import {render, screen} from "@testing-library/react";
import Providers from "@/components/Providers";
import '@testing-library/jest-dom'

jest.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="mocked-toaster" />
}));
describe('Providers', () => {
    test('needs to contain a toaster',()=>{
        const {getByTestId} = render(<Providers>null</Providers>)
        expect(getByTestId('mocked-toaster')).toBeInTheDocument()
    })
    test('renders the children passed to it',()=>{
        render(<Providers><p>My Names June. Whats Yours?</p></Providers>)
        expect(screen.getByText('My Names June. Whats Yours?')).toBeInTheDocument();
    })
})
