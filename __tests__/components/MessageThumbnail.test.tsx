import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import MessageThumbnail from "@/components/MessageThumbnail";

describe('Tests to confirm component renders with correct attributes', () => {
    test('component Renders',()=>{
        render(<MessageThumbnail />)
    });

    test('Component has aria label "user thumbnail"',()=>{
        const {getByLabelText} = render(<MessageThumbnail/>)
        const component = getByLabelText('user thumbnail')
        expect(component).toBeInTheDocument();
    });

    test('If the component has the next message, then it should be invisible',()=>{
        const stats = {hasNextMessage:true}
        const {getByLabelText} = render(<MessageThumbnail userStatus={stats} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/invisible/i)
    });

    test("If the component doesn't has the next message, then it shouldn't be invisible",()=>{
        const stats = {hasNextMessage:false}
        const {getByLabelText} = render(<MessageThumbnail userStatus={stats}/>)
        const component = getByLabelText('user thumbnail')
        expect(component).not.toHaveClass(/invisible/i)
    });

    test("If the user is the current user, then the component should have classname order-2",()=>{
        const stats = {hasNextMessage:false, currentUser: false}
        const {getByLabelText} = render(<MessageThumbnail userStatus={stats}/>)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/order-2/i)
    });

    test("If the user isn't the current user, then the component should have classname order-1",()=>{
        const stats = {hasNextMessage:false, currentUser: true}
        const {getByLabelText} = render(<MessageThumbnail userStatus={stats}/>)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/order-1/i)
    });
})
