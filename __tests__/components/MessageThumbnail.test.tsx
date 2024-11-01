import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import MessageThumbnail from "@/components/MessageThumbnail";
import {Utils} from "@/lib/utils";

describe('Tests to confirm component renders and styling', () => {
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
});

describe('image tests',()=>{
    test("The component needs to contain an image",()=>{
        const {getByRole} = render(<MessageThumbnail/>)
        const component = getByRole('img')
        expect(component).toBeInTheDocument()
    });
    test("The component needs to contain an with the image source pased to it",()=>{
        const {getByRole} = render(<MessageThumbnail/>)
        const component = getByRole('img')
        expect(component).toBeInTheDocument()
    });
    test("The component needs to contain an with the image source passed to it",()=>{
        const userInfo={
            image:'/provided-image'
        }
        const {getByRole} = render(<MessageThumbnail userInfo={userInfo}/>)
        const component = getByRole('img')
        expect(component).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl('/provided-image')));
    });
    test("The component needs to contain an with the image source passed to it, different data",()=>{
        const userInfo={
            image:'/icon'
        }
        const {getByRole} = render(<MessageThumbnail userInfo={userInfo}/>)
        const component = getByRole('img')
        expect(component).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl('/icon')));
    });
    test('image component needs the appropriate alt text',()=>{
        const userInfo={
            userName:'John Stamos'
        }
        const {getByRole} = render(<MessageThumbnail userInfo={userInfo}/>)
        const component = getByRole('img')
        expect(component).toHaveAttribute('alt', 'John Stamos');
    })
    test('image component needs the appropriate alt text',()=>{
        const userInfo={
            userName:'Ada Lovelace'
        }
        const {getByRole} = render(<MessageThumbnail userInfo={userInfo}/>)
        const component = getByRole('img')
        expect(component).toHaveAttribute('alt', 'Ada Lovelace');
    })
});


