import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import Page from '@/app/(dashboard)/chat/page'

describe('ChatPage tests', () => {
    test('page renders',()=>{
        render(<Page/>)
    });
});
