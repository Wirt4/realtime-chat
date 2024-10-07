import '@testing-library/jest-dom'
import {render} from "@testing-library/react";
import Page from '@/app/dashboard/page'

describe('DashboardPage', () => {
    test('Needs to have the page title "dasboard"',()=>{
        render(<Page/>)
        expect(document.title).toBe('dashboard')
    })
})
