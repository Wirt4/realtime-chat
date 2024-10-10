import {render} from "@testing-library/react"
import '@testing-library/jest-dom'
import Page from '@/app/(dashboard)/dashboard/page'

describe('Dashboard Tests',()=>{
    test('Needs to have the page title "dashboard"',async ()=>{
        render(<Page/>)
        expect(document.title).toBe('dashboard')
    })
})

