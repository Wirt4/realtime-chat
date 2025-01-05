import {AbstractFriendsController} from "@/controllers/friends/abstract";
import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";
import {IDenyFriendsService} from "@/services/friends/deny/interface";

export class DenyFriendsController extends AbstractFriendsController {
    async deny(request: Request, service: IDenyFriendsService): Promise<Response> {
        const session = await myGetServerSession()
        let senderId: string
        if (!session) {
            return this.unauthorized()
        }
        try{
            const body = await request.json()
            const { id: idToDeny } = z.object({ id: z.string() }).parse(body)
            senderId = idToDeny
        }catch{
            return this.respond('Invalid Request Payload', 422)
        }
        const ids: Ids = {sessionId: session.user.id, requestId:senderId}
        try {
            await service.removeEntry(ids)
        }catch(error){
            return this.respond(error as string, 424)
        }
        return this.ok()
    }
}
