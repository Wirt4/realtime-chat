import '@testing-library/jest-dom';
import SidebarChatListItem from "@/components/SidebarChatListItem";
import {render} from "@testing-library/react";
import {Utils} from "@/lib/utils";

describe('SidebarChatListItem', () => {
    beforeEach(()=>{
        jest.resetAllMocks()
    })
    test("list item should display the friend's name", ()=>{
        const {getByText} = render(<SidebarChatListItem friend={friendFromName("Elmer")} unseenMessages={1} sessionId="stub"/>);
        const text = getByText("Elmer");
        expect(text).toBeInTheDocument();
    });

    test("list item should display the friend's name, different data", ()=>{
        const {getByText} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={1} sessionId="stub"/>);
        const text = getByText("Lucy");
        expect(text).toBeInTheDocument();
    });

    test('should be a list item',()=>{
        const {getByRole} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={1} sessionId="stub"/>);
        const listItem = getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    })

    test('display count if unseenMessages is over 0',()=>{
        const {getByText} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={1} sessionId="stub"/>);
        const count = getByText('1');
        expect(count).toBeInTheDocument();
    })

    test('do not display count if unseenMessages is  0',()=>{
        const {queryByText} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={0} sessionId="stub"/>);
        const count = queryByText('0');
        expect(count).not.toBeInTheDocument();
    })

   test('display count if unseenMessages is over 0, different amount',()=> {
       const {getByText} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={42} sessionId="stub"/>);
       const count = getByText('42');
       expect(count).toBeInTheDocument();
   })

    test('should have a link',()=>{
        const {getByRole} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={1} sessionId="stub" />);
        const link = getByRole('link');
        expect(link).toBeInTheDocument();
    });

    test('link should have address of "/dashboard/chat/{output of hrefConstructor}"',()=> {
        jest.spyOn(Utils, 'chatHrefConstructor').mockReturnValue('1701--1812')

        const {getByRole} = render(<SidebarChatListItem friend={friendFromName("Lucy")} unseenMessages={1} sessionId="stub"/>);
        const link = getByRole('link');

        expect(link).toHaveAttribute('href', '/dashboard/chat/1701--1812');
    });

    test('link should have address of "/dashboard/chat/{output of hrefConstructor}"',()=> {
        jest.spyOn(Utils, 'chatHrefConstructor').mockReturnValue('batman--robin')

        const {getByRole} = render(<SidebarChatListItem friend={friendFromName("Dick")} unseenMessages={1} sessionId="stub"/>);
        const link = getByRole('link');

        expect(link).toHaveAttribute('href', '/dashboard/chat/batman--robin');
    })

    test('chatUtils should be called with senderId and the session id', ()=>{
        const spy = jest.spyOn(Utils, 'chatHrefConstructor');
        const friend = {id:"1234", email:"stub", name: "stub", image:"stub"}

        render(<SidebarChatListItem friend={friend} unseenMessages={1} sessionId='5678'/>);

        expect(spy).toHaveBeenCalledWith("1234","5678" )
    })

    test('chatUtils should be called with senderId and the session id, different data', ()=>{
        const spy = jest.spyOn(Utils, 'chatHrefConstructor');
        const friend = {id:"batman", email:"stub", name: "stub", image:"stub"}

        render(<SidebarChatListItem friend={friend} unseenMessages={1} sessionId='robin'/>);

        expect(spy).toHaveBeenCalledWith("batman","robin" )
    })
});

const friendFromName = (name:string) =>{
    return {id:"foo", email:"bar", name, image:"spam"}
}
