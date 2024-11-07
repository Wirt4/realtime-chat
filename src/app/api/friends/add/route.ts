import {PostFriendsRouteHandler} from "@/app/api/friends/add/handler";


export async function  POST(req: Request):Promise<Response> {

    const routeHandler = new PostFriendsRouteHandler()
    const body = await req.json()
    const validRequest = await routeHandler.isValidRequest({email: body.email})

    if (!validRequest) {
        const {message, opts} = routeHandler.errorResponse()
        return new Response(message, opts)
    }

    routeHandler.triggerPusherServer()
    await routeHandler.addToDB()
    return new Response('OK')

}
