import {ServicePusher} from "@/services/pusher/service";
import PusherServer from "pusher";

describe('pusher service addFriend', () => {
    it('pusherService.trigger() should call the correct library functionality', ()=>{
        const mockClient = {
            trigger: jest.fn()
        }
        const pusher = new ServicePusher(mockClient as unknown as PusherServer)
        pusher.addFriend('bob', { userId: 'alice'})
        expect(mockClient.trigger).toHaveBeenCalledWith('user__bob__friends', "new_friend", { userId: 'alice'})
    })
})

describe('pusher service acceptFriend', () => {
    it('pusherService.trigger() should call the correct library functionality', ()=>{
        const mockClient = {
            trigger: jest.fn()
        }
        const pusher = new ServicePusher(mockClient as unknown as PusherServer)
        pusher.addFriendRequest('bob', 'alice', 'bob@bob.com')
        expect(mockClient.trigger).toHaveBeenCalledWith(
            "user__alice__incoming_friend_requests",
            "incoming_friend_requests",
            {"senderEmail": "bob@bob.com", "senderId": "bob"}
        )
    })
})

describe('pusher service denyFriend', () => {
    it('pusherService.trigger() should call the correct library functionality',async ()=>{
        const mockClient = {
            trigger: jest.fn()
        }
        const pusher = new ServicePusher(mockClient as unknown as PusherServer)
        await pusher.denyFriendRequest("foo","bar")
        expect(mockClient.trigger).toHaveBeenCalledWith("user__foo__friends", "deny_friend", "bar")
    })
})
