import {render} from "@testing-library/react"
import RootLayout from "@/app/layout"
import '@testing-library/jest-dom'
import {ReactNode} from "react";


jest.mock('@/components/ToastErrorHandler', () => ({
    __esModule: true,
    default: ({ children }:  { children: ReactNode }) => <div data-testid="toast-handler">{children}</div>
}))

describe('Providers', () => {
    test('needs to contain a A Provider',()=>{
        const {getByTestId} = render(<RootLayout>null</RootLayout>)
        expect(getByTestId('toast-handler')).toBeInTheDocument()
    })
})
