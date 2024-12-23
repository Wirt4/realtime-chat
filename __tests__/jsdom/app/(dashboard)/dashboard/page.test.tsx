import {render} from "@testing-library/react"
import '@testing-library/jest-dom'
import Page from '@/app/(dashboard)/dashboard/page'

describe('Dashboard Tests',()=>{
    test('page needs to render without error', ()=>{
        render(<Page/>)
    })
})
