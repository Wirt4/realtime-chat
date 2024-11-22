import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/dashboard/page";
import {render} from "@testing-library/react";

describe('Page tests', () => {
    test('Make sure page renders without errors',()=>{
        render(<Page />)
    })
})
