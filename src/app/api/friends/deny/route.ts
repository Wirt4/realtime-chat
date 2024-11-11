import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";
import {removeDbEntry} from "@/lib/dbWrapper";
import QueryBuilder from "@/lib/queryBuilder";

export async function POST(req:Request) {
    const session = await myGetServerSession()
    
    if (!session) {
        return returnResponse('Unauthorized', 401)
    }

    try{
        const body = await req.json()
        z.object({ id: z.string() }).parse(body)
    }catch{
        return returnResponse('Invalid Request payload', 421)
    }

    try{
        await removeDbEntry(QueryBuilder.incomingFriendRequests(session.user.id), 'lColumbo')
        return returnResponse('OK', 200);
    }catch{
        return returnResponse('Redis Error', 424)
    }

}

function returnResponse(message: string, status: number): Response {
    return new Response(message, {status})
}
