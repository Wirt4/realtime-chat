import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import MessageThumbnail from "@/components/MessageThumbnail";
import {Utils} from "@/lib/utils";

describe('Tests to confirm component renders and styling', () => {
    let userStatus: {hasNextMessage: boolean, currentUser:boolean}
    const userInfo:{image:string, userName: string} = {image:'/stub', userName:'stub'}
    beforeEach(()=>{
        userStatus = {hasNextMessage: false, currentUser: false};
    })

    test('component Renders',()=>{
        render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
    });

    test('Component has aria label "user thumbnail"',()=>{
        const {getByLabelText} =  render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toBeInTheDocument();
    });

    test('The component needs to have the height and width bound',()=>{
        userStatus.hasNextMessage = true
        const {getByLabelText} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/relative/i)
        expect(component).toHaveClass(/h-6/i)
        expect(component).toHaveClass(/w-6/i)
    });

    test('If the component has the next message, then it should be invisible',()=>{
        userStatus.hasNextMessage = true
        const {getByLabelText} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/invisible/i)
    });

    test("If the component doesn't has the next message, then it shouldn't be invisible",()=>{
        userStatus.hasNextMessage = false
        const {getByLabelText} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).not.toHaveClass(/invisible/i)
    });

    test("If the user is the current user, then the component should have classname order-2",()=>{
        userStatus.hasNextMessage = false
        userStatus.currentUser = false
        const {getByLabelText} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/order-2/i)
    });

    test("If the user isn't the current user, then the component should have classname order-1",()=>{
        userStatus.hasNextMessage = false
        userStatus.currentUser = true
        const {getByLabelText} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByLabelText('user thumbnail')
        expect(component).toHaveClass(/order-1/i)
    });
});

describe('image tests',()=>{
    const userStatus: {hasNextMessage: boolean, currentUser:boolean} = {hasNextMessage: false, currentUser: false};
    let userInfo:{image:string, userName: string} = {image:'stub', userName:'stub'}

    beforeEach(()=>{
        userInfo = {image:'/stub', userName:'stub'}
    })
    test("The component needs to contain an image",()=>{
        const {getByRole} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByRole('img')
        expect(component).toBeInTheDocument()
    });

    test("The component needs to contain an with the image source passed to it",()=>{
        userInfo.image = '/provided-image'
        const {getByRole} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByRole('img')
        expect(component).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl('/provided-image')));
    });
    test("The component needs to contain an with the image source passed to it, different data",()=>{
        userInfo.image ='/icon'
        const {getByRole} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByRole('img')
        expect(component).toHaveAttribute('src',
            expect.stringContaining(Utils.encodeUrl('/icon')));
    });
    test('image component needs the appropriate alt text',()=>{
        userInfo.userName = 'John Stamos';
        const {getByRole} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByRole('img')
        expect(component).toHaveAttribute('alt', 'John Stamos');
    })
    test('image component needs the appropriate alt text',()=>{
        userInfo.userName = 'Ada Lovelace'
        const {getByRole} = render(<MessageThumbnail userStatus={userStatus} userInfo={userInfo} />)
        const component = getByRole('img')
        expect(component).toHaveAttribute('alt', 'Ada Lovelace');
    });
});


