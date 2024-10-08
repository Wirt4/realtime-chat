import '@testing-library/jest-dom'
import Page from "@/app/(dashboard)/add/page"
import {render} from "@testing-library/react";

describe('Add Page tests',()=>{

   test('Document should instruct you to add a friend', async ()=>{
      render(<Page/>)
       expect("Add a Friend").toBeInTheDocument()
    })

})

