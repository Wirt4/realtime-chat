import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import MessageThumbnail from "@/components/MessageThumbnail";

describe('Tests to confirm component renders with correct attributes', () => {
    test('component Renders',()=>{
        render(<MessageThumbnail/>)
    });

    test('Component has aria label "user thumbnail"',()=>{
        const {getByLabelText} = render(<MessageThumbnail/>)
        const component = getByLabelText('user thumbnail')
        expect(component).toBeInTheDocument();
    });
})
