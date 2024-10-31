import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import MessageThumbnail from "@/components/MessageThumbnail";

describe('MessageThumbnail tests', () => {
    test('component Renders',()=>{
        render(<MessageThumbnail/>)
    })
})
