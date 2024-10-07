import {render} from "@testing-library/react";
import Providers from "@/components/Providers";
import '@testing-library/jest-dom'

jest.mock('react-hot-toast', () => ({
    Toaster: () => <div data-testid="mocked-toaster" />
}));
describe('Providers', () => {
    test('needs to contain a toaster',()=>{
        const {getByTestId} = render(<Providers/>)
        expect(getByTestId('mocked-toaster')).toBeInTheDocument()
    })
})
