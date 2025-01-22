import '@testing-library/jest-dom';
import SidebarChatListItem from "@/components/Sidebar/ChatListItem/SidebarChatListItem";
import { render } from "@testing-library/react";

describe('SidebarChatListItem', () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })
    test("list item should display the friend's names", () => {
        const participants: User[] = [
            { name: "Alfred", id: "foo", email: "bar", image: "/spam" },
            { name: "theUser", id: "bar", email: "bar", image: "/spam" },
            { name: "Betty", id: "foo", email: "bar", image: "/spam" },
            { name: "Charlie", id: "foo", email: "bar", image: "/spam" },
        ]
        const { getByText } = render(<SidebarChatListItem sessionId="bar" unseenMessages={0} participants={participants} chatId='stub' />);
        const text = getByText("Chat with Alfred, Betty, and Charlie");
        expect(text).toBeInTheDocument();
    });

    test("list item should display the friend's name, different data", () => {
        const participants: User[] = [
            { name: "Lucy", id: "foo", email: "bar", image: "/spam" },
            { name: "theUser", id: "bar", email: "bar", image: "/spam" }
        ]
        const { getByText } = render(<SidebarChatListItem sessionId="bar" unseenMessages={0} participants={participants} chatId='stub' />);
        const text = getByText("Chat with Lucy");
        expect(text).toBeInTheDocument();
    });

    test('should be a list item', () => {
        const { getByRole } = render(<SidebarChatListItem sessionId="foo" unseenMessages={0} participants={[friendFromName("stub"), friendFromName("stub")]} chatId='stub' />);
        const listItem = getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    })

    test('display count if unseenMessages is over 0', () => {
        const { getByText } = render(<SidebarChatListItem sessionId="foo" unseenMessages={1} participants={[friendFromName("stub"), friendFromName("stub")]} chatId='stub' />);
        const count = getByText('1');
        expect(count).toBeInTheDocument();
    })

    test('do not display count if unseenMessages is  0', () => {
        const { queryByText } = render(<SidebarChatListItem sessionId="foo" unseenMessages={0} participants={[friendFromName("stub"), friendFromName("stub")]} chatId='stub' />);
        const count = queryByText('0');
        expect(count).not.toBeInTheDocument();
    })

    test('display count if unseenMessages is over 0, different amount', () => {
        const { getByText } = render(<SidebarChatListItem sessionId="foo" unseenMessages={42} participants={[friendFromName("stub"), friendFromName("stub")]} chatId='stub' />);
        const count = getByText('42');
        expect(count).toBeInTheDocument();
    })

    test('should have a link', () => {
        const { getByRole } = render(<SidebarChatListItem sessionId="foo" unseenMessages={4} participants={[friendFromName("stub"), friendFromName("stub")]} chatId='stub' />);
        const link = getByRole('link');
        expect(link).toBeInTheDocument();
    });

    test('link should have address of "/dashboard/chat/{output of hrefConstructor}"', () => {
        const { getByRole } = render(<SidebarChatListItem sessionId="foo" unseenMessages={42} participants={[friendFromName("stub"), friendFromName("stub")]} chatId={'1701--1812'} />);
        const link = getByRole('link');

        expect(link).toHaveAttribute('href', '/dashboard/chat/1701--1812');
    });

    test('link should have address of "/dashboard/chat/{output of hrefConstructor}"', () => {
        const { getByRole } = render(<SidebarChatListItem sessionId="foo" unseenMessages={0} participants={[friendFromName("stub"), friendFromName("stub")]} chatId={'batman--robin'} />);
        const link = getByRole('link');

        expect(link).toHaveAttribute('href', '/dashboard/chat/batman--robin');
    });
});

const friendFromName = (name: string) => {
    return { id: "foo", email: "bar", name, image: "/spam" }
}
