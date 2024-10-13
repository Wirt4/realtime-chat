import FriendRequestEffect from "@/components/friendRequestSidebarOptions/FriendRequestEffect";
describe('FriendRequestEffect tests, test the anonymous function returned', () => {
    test('expect pusherClient.subscribe to be called for user__1701__incoming_friend_requests',()=>{
        const anon = FriendRequestEffect()
        anon()

    })
});