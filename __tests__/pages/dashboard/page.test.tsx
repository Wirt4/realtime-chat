import '@testing-library/jest-dom'
import {render} from "@testing-library/react";
import Dashboard from  '@/app/pages/dashboard/page'

describe('DashboardPage', () => {
    test('Needs to have the page title "dasboard"',()=>{
        render(<Dashboard/>)
        expect(document.title).toBe('dashboard')
    })
})
