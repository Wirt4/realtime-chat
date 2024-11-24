import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/dashboard/page";
import {render} from "@testing-library/react";

describe('Page tests', () => {
    test('Page renders.',()=>{
        render(<Page />)
    })
    test('Given the page renders correctly: when the page renders, then it should have the title "Wirt Salthouse\'s Chat App"',()=>{
        render(<Page />)
        expect(document.title).toBe("Wirt Salthouse's Chat App")
    })
})
