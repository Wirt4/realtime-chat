import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
describe('Layout tests',()=>{
    test('renders without crashing',()=>
        render(<Layout/>)
    )
})