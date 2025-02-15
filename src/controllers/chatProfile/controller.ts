//stub

import myGetServerSession from "@/lib/myGetServerSession";

//1 get session id
//2 if session id is not null, go to step 4
//3 return status 401
//4 If the request body is formatted with a participants string array, go to step 6
//5 return status 400
//6 convert the participants array to a set
//7 pass the set to the service
//8 return the result of the service in an response object with body {chatId: <chatId>}

export class ChatProfileController {
    async getChatIdFromUsers(request: Request): Promise<Response> {
        const session = await myGetServerSession();
        if (!session) {
            return new Response("", { status: 401 });
        }
        return new Response("", { status: 405 });
    }
}
