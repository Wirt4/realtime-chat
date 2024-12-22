import {z} from "zod";
import {AbstractFriendsController} from "@/controllers/friends/abstract";

export class RemoveFriendsController extends AbstractFriendsController {
    async remove(request: Request) {
        let targetId: string

        try{
            targetId = z.object({idToRemove: z.string()}).parse(await request.json()).idToRemove;
        }catch{
            return new Response('Invalid Format', {status: 422})
        }
        return new Response('OK', {status: 200})
    }
}
